<?php

namespace App\Services;

use App\Enums\FuelPolicy;
use App\Enums\RentalStatus;
use App\Enums\ReservationStatus;
use App\Enums\VehicleStatus;
use App\Models\Rental;
use App\Models\Reservation;
use App\Models\Vehicle;
use App\Models\VehicleScheduleBlock;
use App\Repositories\RentalRepository;
use App\Repositories\ReservationRepository;
use App\Services\FinancialService;
use Carbon\Carbon;
use DomainException;
use Illuminate\Support\Facades\DB;

class RentalService
{
    public function __construct(
        private readonly RentalRepository $rentals,
        private readonly RentalValidator $validator,
        private readonly RentalStatusManager $statusManager,
        private readonly VehicleStatusManager $vehicleStatusManager,
        private readonly ReservationRepository $reservations,
        private readonly ReservationStatusManager $reservationStatusManager,
        private readonly FinancialService $financialService,
    ) {
    }

    public function create(array $data): Rental
    {
        return DB::transaction(function () use ($data) {
            $vehicle = Vehicle::whereKey($data['vehicle_id'])->lockForUpdate()->firstOrFail();

            $payload = RentalFactory::make($data, $vehicle);

            $this->validator->validateAvailability(
                $payload['vehicle_id'],
                Carbon::parse($payload['pickup_date']),
                Carbon::parse($payload['planned_return_date'])
            );
            $this->validator->validatePickupData($vehicle, $payload);

            $rental = Rental::create($payload);

            $rental->subtotal = $rental->calculateSubtotal();
            $rental->total = $rental->calculateTotal();
            $rental->save();

            $this->rentals->createBlock(
                $rental->vehicle_id,
                $rental->id,
                Carbon::parse($rental->pickup_date),
                Carbon::parse($rental->planned_return_date)
            );

            $this->vehicleStatusManager->setStatus($vehicle, VehicleStatus::RENTED);
            $this->financialService->provisionRental($rental);

            return $rental->refresh();
        });
    }

    public function fromReservation(Reservation $reservation, array $data): Rental
    {
        if (in_array($reservation->status?->value ?? $reservation->status, [
            ReservationStatus::CANCELLED->value,
            ReservationStatus::COMPLETED->value,
        ], true)) {
            throw new DomainException('Reserva nao pode ser convertida.');
        }

        $reservation->loadMissing('vehicle');

        return DB::transaction(function () use ($reservation, $data) {
            $payload = RentalFactory::fromReservation($reservation, $data);

            $vehicle = Vehicle::whereKey($payload['vehicle_id'])->lockForUpdate()->firstOrFail();

            $this->validator->validateAvailability(
                $payload['vehicle_id'],
                Carbon::parse($payload['pickup_date']),
                Carbon::parse($payload['planned_return_date']),
                ignoreRentalId: null,
                ignoreReservationId: $reservation->id
            );
            $this->validator->validatePickupData($vehicle, $payload);

            $rental = Rental::create($payload);
            $rental->subtotal = $rental->calculateSubtotal();
            $rental->total = $rental->calculateTotal();
            $rental->save();

            $this->reservations->removeBlock($reservation->id);
            $this->rentals->createBlock(
                $rental->vehicle_id,
                $rental->id,
                Carbon::parse($rental->pickup_date),
                Carbon::parse($rental->planned_return_date)
            );

            $this->reservationStatusManager->transition($reservation, ReservationStatus::COMPLETED);
            $this->vehicleStatusManager->setStatus($vehicle, VehicleStatus::RENTED);
            $this->financialService->reclassifyReservation($reservation, $rental);
            $this->financialService->provisionRental($rental);

            return $rental->refresh();
        });
    }

    public function checkOut(Rental $rental, array $data): Rental
    {
        $this->validator->ensureActive($rental);
        $this->validator->validateReturnData($rental, $data);

        return DB::transaction(function () use ($rental, $data) {
            $vehicle = Vehicle::whereKey($rental->vehicle_id)->lockForUpdate()->firstOrFail();

            $rental->fill([
                'return_date' => $data['return_date'],
                'odometer_return' => $data['odometer_return'],
                'fuel_return' => $data['fuel_return'] ?? $rental->fuel_return,
                'photos_return' => $data['photos_return'] ?? $rental->photos_return,
                'checklist_return' => $data['checklist_return'] ?? $rental->checklist_return,
                'damage_cost' => $data['damage_cost'] ?? $rental->damage_cost,
                'extra_charges' => $data['extra_charges'] ?? $rental->extra_charges,
                'discounts' => $data['discounts'] ?? $rental->discounts,
                'notes' => $data['notes'] ?? $rental->notes,
            ]);

            $rental->extra_km = $rental->calculateExtraKm();
            $rental->late_fee_total = $rental->calculateLateFee();

            $fuelPolicy = $rental->fuel_policy instanceof FuelPolicy ? $rental->fuel_policy->value : $rental->fuel_policy;
            if ($fuelPolicy !== FuelPolicy::PREPAID->value && isset($data['tank_capacity'], $data['fuel_price'])) {
                $rental->fuel_charge = $rental->calculateFuelCharge(
                    (float) $data['tank_capacity'],
                    (float) $data['fuel_price']
                );
            }

            $rental->subtotal = $rental->calculateSubtotal();
            $rental->total = $rental->calculateTotal();

            $this->statusManager->transition($rental, RentalStatus::COMPLETED);

            $vehicle->mileage = $rental->odometer_return;
            $vehicle->save();

            $this->rentals->removeBlock($rental->id);

            if (!empty($data['mark_maintenance'])) {
                $maintenanceEnd = !empty($data['maintenance_end_date'])
                    ? Carbon::parse($data['maintenance_end_date'])
                    : Carbon::parse($rental->return_date)->addDays(2);

                VehicleScheduleBlock::updateOrCreate(
                    [
                        'vehicle_id' => $rental->vehicle_id,
                        'source_type' => 'maintenance',
                        'source_id' => $rental->id,
                    ],
                    [
                        'start_date' => $rental->return_date,
                        'end_date' => $maintenanceEnd,
                    ]
                );

                $this->vehicleStatusManager->setStatus($vehicle, VehicleStatus::MAINTENANCE);
            } else {
                $this->vehicleStatusManager->setStatus($vehicle, VehicleStatus::AVAILABLE);
            }

            $this->financialService->reconcileRental(
                $rental,
                markPaid: (bool) ($data['mark_as_paid'] ?? false),
                paidAt: !empty($data['paid_at']) ? Carbon::parse($data['paid_at']) : null
            );

            return $rental->refresh();
        });
    }

    public function cancel(Rental $rental): Rental
    {
        if (!$rental->isActive()) {
            throw new DomainException('Somente locacoes ativas podem ser canceladas.');
        }

        $createdAt = $rental->created_at ? Carbon::parse($rental->created_at) : Carbon::now();
        if ($createdAt->diffInMinutes(Carbon::now()) > 5) {
            throw new DomainException('Cancelamento permitido apenas antes do check-in efetivo.');
        }

        return DB::transaction(function () use ($rental) {
            $vehicle = Vehicle::whereKey($rental->vehicle_id)->lockForUpdate()->first();

            $this->statusManager->transition($rental, RentalStatus::CANCELLED);
            $this->rentals->removeBlock($rental->id);
            $this->financialService->cancelBySource('rental', $rental->id);

            if ($vehicle && ($vehicle->status?->value ?? $vehicle->status) !== VehicleStatus::AVAILABLE->value) {
                $this->vehicleStatusManager->setStatus($vehicle, VehicleStatus::AVAILABLE);
            }

            return $rental->refresh();
        });
    }

    public function reportDamage(Rental $rental, array $data): Rental
    {
        $this->validator->ensureActive($rental);

        if (!empty($data['close_rental'])) {
            return $this->checkOut($rental, [
                'return_date' => $data['return_date'] ?? Carbon::now(),
                'odometer_return' => $data['odometer_return'] ?? $rental->odometer_pickup,
                'fuel_return' => $data['fuel_return'] ?? $rental->fuel_pickup,
                'damage_cost' => $data['damage_cost'] ?? $rental->damage_cost,
                'extra_charges' => $data['extra_charges'] ?? $rental->extra_charges,
                'discounts' => $data['discounts'] ?? $rental->discounts,
                'notes' => $data['notes'] ?? $rental->notes,
                'mark_maintenance' => true,
                'maintenance_end_date' => $data['maintenance_end_date'] ?? null,
                'tank_capacity' => $data['tank_capacity'] ?? null,
                'fuel_price' => $data['fuel_price'] ?? null,
                'photos_return' => $data['photos_return'] ?? null,
                'checklist_return' => $data['checklist_return'] ?? null,
            ]);
        }

        return DB::transaction(function () use ($rental, $data) {
            $vehicle = Vehicle::whereKey($rental->vehicle_id)->lockForUpdate()->first();

            $rental->damage_notes = $data['damage_notes'] ?? $rental->damage_notes;
            $rental->damage_cost = $data['damage_cost'] ?? $rental->damage_cost;
            $rental->extra_charges = ($rental->extra_charges ?? 0) + ($data['extra_charges'] ?? 0);
            $rental->photos_return = $data['photos_return'] ?? $rental->photos_return;
            $rental->checklist_return = $data['checklist_return'] ?? $rental->checklist_return;
            $rental->save();

            if (!empty($data['mark_maintenance']) && $vehicle) {
                $blockStart = Carbon::parse($rental->planned_return_date ?? Carbon::now());
                $blockEnd = $blockStart->copy()->addDays(3);

                VehicleScheduleBlock::updateOrCreate(
                    [
                        'vehicle_id' => $rental->vehicle_id,
                        'source_type' => 'maintenance',
                        'source_id' => $rental->id,
                    ],
                    [
                        'start_date' => $blockStart,
                        'end_date' => $blockEnd,
                    ]
                );

                $this->vehicleStatusManager->setStatus($vehicle, VehicleStatus::MAINTENANCE);
            }

            return $rental->refresh();
        });
    }
}
