<?php

namespace App\Repositories;

use App\Enums\VehicleCategory;
use App\Enums\VehicleStatus;
use App\Models\Vehicle;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class VehicleRepository
{
    public function filterVehicles(array $filters = []): LengthAwarePaginator
    {
        $query = Vehicle::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search) {
                $q->where('model', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('plate', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['category']) && $filters['category'] !== 'all') {
            $query->where('category', $filters['category']);
        }

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        return $query->paginate(15)->withQueryString();
    }

    public function findWithRelations(int $vehicleId): Vehicle
    {
        $vehicle = Vehicle::with([
            'reservations' => function ($query) {
                $query->latest()->limit(5);
            },
            'rentals' => function ($query) {
                $query->latest()->limit(5);
            },
            'maintenances' => function ($query) {
                $query->latest()->limit(5);
            },
        ])->findOrFail($vehicleId);

        $vehicle->stats = $this->getStats($vehicle);

        return $vehicle;
    }

    public function checkPlateAvailability(string $plate, ?int $vehicleId = null): bool
    {
        $normalized = strtoupper(str_replace([' ', '-'], '', $plate));

        $query = Vehicle::where('plate', $normalized);

        if ($vehicleId) {
            $query->where('id', '!=', $vehicleId);
        }

        return !$query->exists();
    }

    public function hasActiveReservations(Vehicle $vehicle): bool
    {
        return $vehicle->reservations()
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();
    }

    public function countersByStatus(): array
    {
        return Vehicle::selectRaw("status, COUNT(*) as total")
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();
    }

    public function getStats(Vehicle $vehicle): array
    {
        $rentals = method_exists($vehicle, 'rentals') ? $vehicle->rentals() : null;
        $maintenances = method_exists($vehicle, 'maintenances') ? $vehicle->maintenances() : null;
        $fines = method_exists($vehicle, 'fines') ? $vehicle->fines() : null;

        return [
            'total_rentals' => $rentals ? (int) $rentals->count() : 0,
            'rentals_this_year' => $rentals
                ? (int) $rentals->whereYear('created_at', date('Y'))->count()
                : 0,
            'maintenances' => $maintenances ? (int) $maintenances->count() : 0,
            'fines' => $fines ? (int) $fines->count() : 0,
        ];
    }
}
