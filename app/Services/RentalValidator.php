<?php

namespace App\Services;

use App\Models\Rental;
use App\Models\Vehicle;
use App\Repositories\RentalRepository;
use Carbon\Carbon;
use DomainException;

class RentalValidator
{
    public function __construct(private readonly RentalRepository $rentals)
    {
    }

    public function validateAvailability(
        int $vehicleId,
        Carbon $start,
        Carbon $end,
        ?int $ignoreRentalId = null,
        ?int $ignoreReservationId = null
    ): void {
        if ($this->rentals->overlapsSchedule($vehicleId, $start, $end, $ignoreRentalId, $ignoreReservationId)) {
            throw new DomainException('Periodo indisponivel para o veiculo selecionado.');
        }
    }

    public function validatePickupData(Vehicle $vehicle, array $payload): void
    {
        if (empty($payload['planned_return_date'])) {
            throw new DomainException('planned_return_date e obrigatorio.');
        }

        $pickupOdometer = (int) ($payload['odometer_pickup'] ?? 0);
        if ($pickupOdometer < (int) $vehicle->mileage) {
            throw new DomainException('Odometro de retirada nao pode ser menor que a quilometragem do veiculo.');
        }

        if (isset($payload['fuel_pickup']) && !$this->isFuelLevelValid($payload['fuel_pickup'])) {
            throw new DomainException('fuel_pickup deve estar entre 0 e 1.');
        }

        $pickup = Carbon::parse($payload['pickup_date']);
        $plannedReturn = Carbon::parse($payload['planned_return_date']);
        if ($pickup->gte($plannedReturn)) {
            throw new DomainException('Data de devolucao planejada deve ser maior que a de retirada.');
        }

        $vehicleStatus = $vehicle->status?->value ?? $vehicle->status;

        if ($vehicleStatus === 'maintenance') {
            throw new DomainException('Veiculo em manutencao nao pode ser locado.');
        }

        if ($vehicleStatus === 'rented') {
            throw new DomainException('Veiculo ja esta locado.');
        }
    }

    public function validateReturnData(Rental $rental, array $data): void
    {
        $returnDate = Carbon::parse($data['return_date']);

        if ($returnDate->lte(Carbon::parse($rental->pickup_date))) {
            throw new DomainException('return_date deve ser maior que pickup_date.');
        }

        $odometerReturn = (int) ($data['odometer_return'] ?? 0);
        if ($odometerReturn < (int) $rental->odometer_pickup) {
            throw new DomainException('Odometro de devolucao nao pode ser menor que o da retirada.');
        }

        if (isset($data['fuel_return']) && !$this->isFuelLevelValid($data['fuel_return'])) {
            throw new DomainException('fuel_return deve estar entre 0 e 1.');
        }
    }

    public function ensureActive(Rental $rental): void
    {
        if (!$rental->isActive()) {
            throw new DomainException('Locacao precisa estar ativa para esta operacao.');
        }
    }

    private function isFuelLevelValid(mixed $value): bool
    {
        if ($value === null) {
            return true;
        }

        $level = (float) $value;

        return $level >= 0 && $level <= 1;
    }
}
