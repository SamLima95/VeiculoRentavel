<?php

namespace App\Repositories;

use App\Enums\RentalStatus;
use App\Models\Rental;
use App\Models\Vehicle;
use App\Models\VehicleScheduleBlock;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class RentalRepository
{
    public function filter(array $filters = []): LengthAwarePaginator
    {
        $query = Rental::with(['vehicle', 'client', 'reservation'])
            ->orderBy($filters['sort_by'] ?? 'pickup_date', $filters['sort_order'] ?? 'desc');

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['vehicle_id'])) {
            $query->where('vehicle_id', $filters['vehicle_id']);
        }

        if (!empty($filters['client_id'])) {
            $query->where('client_id', $filters['client_id']);
        }

        if (!empty($filters['start_date'])) {
            $query->whereDate('pickup_date', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('planned_return_date', '<=', $filters['end_date']);
        }

        return $query->paginate(15)->withQueryString();
    }

    public function findWithRelations(int $id): Rental
    {
        return Rental::with(['vehicle', 'client', 'reservation'])->findOrFail($id);
    }

    public function overlapsSchedule(
        int $vehicleId,
        Carbon $start,
        Carbon $end,
        ?int $ignoreRentalId = null,
        ?int $ignoreReservationId = null
    ): bool {
        $query = VehicleScheduleBlock::where('vehicle_id', $vehicleId)
            ->where(function ($q) use ($start, $end) {
                $q->where('start_date', '<', $end)
                    ->where('end_date', '>', $start);
            });

        if ($ignoreRentalId) {
            $query->where(function ($q) use ($ignoreRentalId) {
                $q->where('source_type', '!=', 'rental')
                    ->orWhere(function ($q2) use ($ignoreRentalId) {
                        $q2->where('source_type', 'rental')
                            ->where('source_id', '!=', $ignoreRentalId);
                    });
            });
        }

        if ($ignoreReservationId) {
            $query->where(function ($q) use ($ignoreReservationId) {
                $q->where('source_type', '!=', 'reservation')
                    ->orWhere(function ($q2) use ($ignoreReservationId) {
                        $q2->where('source_type', 'reservation')
                            ->where('source_id', '!=', $ignoreReservationId);
                    });
            });
        }

        return $query->exists();
    }

    public function conflicts(
        int $vehicleId,
        Carbon $start,
        Carbon $end,
        ?int $ignoreRentalId = null
    ): Collection {
        $query = VehicleScheduleBlock::where('vehicle_id', $vehicleId)
            ->where(function ($q) use ($start, $end) {
                $q->where('start_date', '<', $end)
                    ->where('end_date', '>', $start);
            });

        if ($ignoreRentalId) {
            $query->where(function ($q) use ($ignoreRentalId) {
                $q->where('source_type', '!=', 'rental')
                    ->orWhere(function ($q2) use ($ignoreRentalId) {
                        $q2->where('source_type', 'rental')
                            ->where('source_id', '!=', $ignoreRentalId);
                    });
            });
        }

        return $query->get([
            'vehicle_id',
            'source_type',
            'source_id',
            'start_date',
            'end_date',
        ]);
    }

    public function createBlock(int $vehicleId, int $rentalId, Carbon $start, Carbon $end): void
    {
        VehicleScheduleBlock::updateOrCreate(
            [
                'vehicle_id' => $vehicleId,
                'source_type' => 'rental',
                'source_id' => $rentalId,
            ],
            [
                'start_date' => $start,
                'end_date' => $end,
            ]
        );
    }

    public function removeBlock(int $rentalId): void
    {
        VehicleScheduleBlock::where('source_type', 'rental')
            ->where('source_id', $rentalId)
            ->delete();
    }

    public function countersByStatus(): array
    {
        return Rental::selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();
    }

    public function occupancy(Carbon $start, Carbon $end): float
    {
        $totalVehicles = max(1, Vehicle::count());

        $busyVehicles = VehicleScheduleBlock::where('source_type', 'rental')
            ->where(function ($q) use ($start, $end) {
                $q->where('start_date', '<', $end)
                    ->where('end_date', '>', $start);
            })
            ->distinct('vehicle_id')
            ->count('vehicle_id');

        return round(($busyVehicles / $totalVehicles) * 100, 2);
    }
}
