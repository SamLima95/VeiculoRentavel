<?php

namespace App\Services;

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use DomainException;

class ReservationStatusManager
{
    private array $allowedTransitions = [
        ReservationStatus::PENDING->value => [
            ReservationStatus::CONFIRMED->value,
            ReservationStatus::CANCELLED->value,
        ],
        ReservationStatus::CONFIRMED->value => [
            ReservationStatus::COMPLETED->value,
            ReservationStatus::CANCELLED->value,
        ],
    ];

    public function transition(Reservation $reservation, ReservationStatus $to): Reservation
    {
        $from = $reservation->status instanceof ReservationStatus ? $reservation->status->value : $reservation->status;
        $target = $to->value;

        if (!$this->canTransition($from, $target)) {
            throw new DomainException("Transicao de {$from} para {$target} nao permitida.");
        }

        $reservation->status = $target;
        $reservation->save();

        return $reservation;
    }

    public function canTransition(string $from, string $to): bool
    {
        return in_array($to, $this->allowedTransitions[$from] ?? [], true);
    }
}
