<?php

namespace App\Services;

use App\Enums\RentalStatus;
use App\Models\Rental;
use DomainException;

class RentalStatusManager
{
    private array $allowedTransitions = [
        RentalStatus::ACTIVE->value => [
            RentalStatus::COMPLETED->value,
            RentalStatus::CANCELLED->value,
        ],
    ];

    public function transition(Rental $rental, RentalStatus $to): Rental
    {
        $from = $rental->status instanceof RentalStatus ? $rental->status->value : $rental->status;
        $target = $to->value;

        if (!$this->canTransition($from, $target)) {
            throw new DomainException("Transicao de {$from} para {$target} nao permitida.");
        }

        $rental->status = $target;
        $rental->save();

        return $rental;
    }

    public function canTransition(string $from, string $to): bool
    {
        return in_array($to, $this->allowedTransitions[$from] ?? [], true);
    }
}
