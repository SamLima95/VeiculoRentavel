<?php

namespace App\Services;

use App\Enums\VehicleStatus;
use App\Models\Vehicle;
use DomainException;

class VehicleStatusManager
{
    /**
     * Define allowed transitions between statuses.
     */
    private array $allowedTransitions = [
        VehicleStatus::AVAILABLE->value => [
            VehicleStatus::RENTED->value,
            VehicleStatus::MAINTENANCE->value,
        ],
        VehicleStatus::RENTED->value => [
            VehicleStatus::AVAILABLE->value,
        ],
        VehicleStatus::MAINTENANCE->value => [
            VehicleStatus::AVAILABLE->value,
        ],
    ];

    public function setStatus(Vehicle $vehicle, VehicleStatus $to): Vehicle
    {
        $from = $vehicle->status instanceof VehicleStatus ? $vehicle->status->value : $vehicle->status;
        $target = $to->value;

        if (!$this->canTransition($from, $target)) {
            throw new DomainException("Transição de status {$from} -> {$target} não permitida.");
        }

        $vehicle->status = $target;
        $vehicle->save();

        return $vehicle;
    }

    public function canTransition(string $from, string $to): bool
    {
        return in_array($to, $this->allowedTransitions[$from] ?? [], true);
    }

    public function isInactivationAllowed(Vehicle $vehicle, bool $hasActiveReservations): bool
    {
        $status = $vehicle->status instanceof VehicleStatus ? $vehicle->status->value : $vehicle->status;

        if ($status === VehicleStatus::RENTED->value) {
            return false;
        }

        if ($hasActiveReservations) {
            return false;
        }

        return true;
    }
}
