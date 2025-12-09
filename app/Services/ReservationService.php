<?php

namespace App\Services;

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Models\Vehicle;
use App\Repositories\ReservationRepository;
use App\Services\FinancialService;
use Carbon\Carbon;
use DomainException;

class ReservationService
{
    public function __construct(
        private readonly ReservationRepository $reservations,
        private readonly ReservationStatusManager $statusManager,
        private readonly ReservationValidator $validator,
        private readonly FinancialService $financialService
    ) {
    }

    public function create(array $data): Reservation
    {
        $payload = ReservationFactory::make($data);
        $this->validator->validatePeriod(Carbon::parse($payload['start_date']), Carbon::parse($payload['end_date']));
        $this->validator->validateAvailability($payload['vehicle_id'], $payload['start_date'], $payload['end_date']);

        // Se nao informado, calcular estimativa usando diaria do veiculo (dias completos)
        if (empty($payload['estimated_value'])) {
            $vehicle = Vehicle::find($payload['vehicle_id']);
            if ($vehicle && $vehicle->daily_rate) {
                $payload['estimated_value'] = $this->estimateValue($vehicle->daily_rate, $payload['start_date'], $payload['end_date']);
            }
        }

        $reservation = Reservation::create($payload);

        if (!empty($data['deposit_amount'])) {
            $this->financialService->registerReservationDeposit(
                $reservation,
                (float) $data['deposit_amount'],
                !empty($data['deposit_paid']),
                !empty($data['deposit_paid_at']) ? Carbon::parse($data['deposit_paid_at']) : null
            );
        }

        // Opcional: confirmar direto
        if (!empty($data['confirm'])) {
            $this->confirm($reservation);
        }

        return $reservation;
    }

    public function update(Reservation $reservation, array $data): Reservation
    {
        $start = Carbon::parse($data['start_date'] ?? $reservation->start_date);
        $end = Carbon::parse($data['end_date'] ?? $reservation->end_date);

        $this->validator->validatePeriod($start, $end);
        $this->validator->validateAvailability($reservation->vehicle_id, $start, $end, $reservation->id);

        // Se datas mudarem, remover bloqueio antigo e recriar depois se confirmado
        $datesChanged = !$start->equalTo($reservation->start_date) || !$end->equalTo($reservation->end_date);

        $reservation->update([
            'start_date' => $start,
            'end_date' => $end,
            'estimated_value' => $data['estimated_value'] ?? $reservation->estimated_value,
            'notes' => $data['notes'] ?? $reservation->notes,
            'updated_by' => $data['updated_by'] ?? $reservation->updated_by,
        ]);

        if (!empty($data['deposit_amount'])) {
            $this->financialService->registerReservationDeposit(
                $reservation,
                (float) $data['deposit_amount'],
                !empty($data['deposit_paid']),
                !empty($data['deposit_paid_at']) ? Carbon::parse($data['deposit_paid_at']) : null
            );
        }

        if ($datesChanged && $reservation->status === ReservationStatus::CONFIRMED->value) {
            $this->reservations->removeBlock($reservation->id);
            $this->reservations->createBlock($reservation->vehicle_id, $reservation->id, $start, $end);
        }

        return $reservation;
    }

    public function confirm(Reservation $reservation): Reservation
    {
        $this->validator->validateAvailability($reservation->vehicle_id, $reservation->start_date, $reservation->end_date, $reservation->id);
        $this->statusManager->transition($reservation, ReservationStatus::CONFIRMED);
        $this->reservations->createBlock($reservation->vehicle_id, $reservation->id, $reservation->start_date, $reservation->end_date);
        return $reservation;
    }

    public function cancel(Reservation $reservation): Reservation
    {
        if (in_array($reservation->status, [ReservationStatus::COMPLETED->value, ReservationStatus::CANCELLED->value], true)) {
            throw new DomainException('Nao e possivel cancelar uma reserva finalizada ou ja cancelada.');
        }

        $this->statusManager->transition($reservation, ReservationStatus::CANCELLED);
        $this->reservations->removeBlock($reservation->id);
        $this->financialService->cancelBySource('reservation', $reservation->id);

        return $reservation;
    }

    public function complete(Reservation $reservation): Reservation
    {
        $this->statusManager->transition($reservation, ReservationStatus::COMPLETED);
        $this->reservations->removeBlock($reservation->id);

        return $reservation;
    }

    /**
     * Calcula valor estimado com base na diaria e quantidade de dias.
     */
    private function estimateValue(float $dailyRate, Carbon $start, Carbon $end): float
    {
        $days = max(1, $start->diffInDays($end));
        return round($days * $dailyRate, 2);
    }
}
