<?php

namespace App\Repositories;

use App\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Models\VehicleScheduleBlock;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class ReservationRepository
{
    public function filter(array $filters = []): LengthAwarePaginator
    {
        $query = Reservation::with(['vehicle', 'client'])
            ->orderBy($filters['sort_by'] ?? 'start_date', $filters['sort_order'] ?? 'desc');

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
            $query->whereDate('start_date', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('end_date', '<=', $filters['end_date']);
        }

        return $query->paginate(15)->withQueryString();
    }

    public function findWithRelations(int $id): Reservation
    {
        return Reservation::with(['vehicle', 'client', 'rental'])->findOrFail($id);
    }

    public function overlapsSchedule(int $vehicleId, Carbon $start, Carbon $end, ?int $ignoreReservationId = null): bool
    {
        $blockQuery = VehicleScheduleBlock::where('vehicle_id', $vehicleId)
            ->where(function ($q) use ($start, $end) {
                $q->where('start_date', '<', $end)
                    ->where('end_date', '>', $start);
            });

        if ($ignoreReservationId) {
            $blockQuery->where(function ($q) use ($ignoreReservationId) {
                $q->where('source_type', '!=', 'reservation')
                    ->orWhere(function ($q2) use ($ignoreReservationId) {
                        $q2->where('source_type', 'reservation')
                            ->where('source_id', '!=', $ignoreReservationId);
                    });
            });
        }

        return $blockQuery->exists();
    }

    public function createBlock(int $vehicleId, int $reservationId, Carbon $start, Carbon $end): void
    {
        VehicleScheduleBlock::updateOrCreate(
            [
                'vehicle_id' => $vehicleId,
                'source_type' => 'reservation',
                'source_id' => $reservationId,
            ],
            [
                'start_date' => $start,
                'end_date' => $end,
            ]
        );
    }

    public function removeBlock(int $reservationId): void
    {
        VehicleScheduleBlock::where('source_type', 'reservation')
            ->where('source_id', $reservationId)
            ->delete();
    }

    public function countersByStatus(): array
    {
        return Reservation::selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();
    }

    public function conflicts(int $vehicleId, Carbon $start, Carbon $end, ?int $ignoreReservationId = null): Collection
    {
        $query = VehicleScheduleBlock::where('vehicle_id', $vehicleId)
            ->where(function ($q) use ($start, $end) {
                $q->where('start_date', '<', $end)
                    ->where('end_date', '>', $start);
            });

        if ($ignoreReservationId) {
            $query->where(function ($q) use ($ignoreReservationId) {
                $q->where('source_type', '!=', 'reservation')
                    ->orWhere(function ($q2) use ($ignoreReservationId) {
                        $q2->where('source_type', 'reservation')
                            ->where('source_id', '!=', $ignoreReservationId);
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
}
