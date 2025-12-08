<?php

namespace App\Services;

use App\Models\Vehicle;
use App\Repositories\VehicleRepository;
use DomainException;

class VehicleService
{
    public function __construct(
        private readonly VehicleRepository $vehicles,
        private readonly VehicleStatusManager $statusManager
    ) {
    }

    public function create(array $data): Vehicle
    {
        $vehicle = Vehicle::create($data);

        AuditLogService::logCreated(
            $vehicle,
            "Veículo {$vehicle->brand} {$vehicle->model} (Placa: {$vehicle->plate}) criado"
        );

        return $vehicle;
    }

    public function update(Vehicle $vehicle, array $data): Vehicle
    {
        $oldValues = $vehicle->getAttributes();

        $vehicle->update($data);

        AuditLogService::logUpdated(
            $vehicle,
            $oldValues,
            "Veículo {$vehicle->brand} {$vehicle->model} (Placa: {$vehicle->plate}) atualizado"
        );

        return $vehicle;
    }

    public function inactivate(Vehicle $vehicle): void
    {
        $hasActiveReservations = $this->vehicles->hasActiveReservations($vehicle);

        if (!$this->statusManager->isInactivationAllowed($vehicle, $hasActiveReservations)) {
            throw new DomainException('Não é possível inativar este veículo (locado ou com reserva ativa).');
        }

        $vehicle->delete();

        AuditLogService::logDeleted(
            $vehicle,
            "Veículo {$vehicle->brand} {$vehicle->model} (Placa: {$vehicle->plate}) inativado"
        );
    }

    public function checkPlateAvailability(string $plate, ?int $vehicleId = null): bool
    {
        return $this->vehicles->checkPlateAvailability($plate, $vehicleId);
    }
}
