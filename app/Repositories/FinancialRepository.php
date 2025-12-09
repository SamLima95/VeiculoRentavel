<?php

namespace App\Repositories;

use App\Enums\FinancialEntryNature;
use App\Enums\FinancialEntryStatus;
use App\Enums\FinancialEntryType;
use App\Models\FinancialEntry;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class FinancialRepository
{
    public function filter(array $filters = []): LengthAwarePaginator
    {
        $query = $this->applyFilters(FinancialEntry::with(['vehicle', 'client']), $filters)
            ->orderBy($filters['sort_by'] ?? 'entry_date', $filters['sort_order'] ?? 'desc');

        return $query->paginate(15)->withQueryString();
    }

    public function findWithRelations(int $id): FinancialEntry
    {
        return FinancialEntry::with(['vehicle', 'client'])->findOrFail($id);
    }

    public function findByKey(string $sourceType, int $sourceId, FinancialEntryType|string $type): ?FinancialEntry
    {
        $typeValue = $type instanceof FinancialEntryType ? $type->value : $type;

        return FinancialEntry::where('source_type', $sourceType)
            ->where('source_id', $sourceId)
            ->where('type', $typeValue)
            ->first();
    }

    public function bySource(string $sourceType, int $sourceId): Collection
    {
        return FinancialEntry::where('source_type', $sourceType)
            ->where('source_id', $sourceId)
            ->get();
    }

    public function cancelBySource(string $sourceType, int $sourceId): void
    {
        FinancialEntry::where('source_type', $sourceType)
            ->where('source_id', $sourceId)
            ->update([
                'status' => FinancialEntryStatus::CANCELLED->value,
                'is_overdue' => false,
            ]);
    }

    public function summary(array $filters = []): array
    {
        $filtersWithoutStatus = $filters;
        unset($filtersWithoutStatus['status']);

        return [
            'estimated_revenue' => $this->sumByNatureAndStatus(FinancialEntryNature::CREDIT, FinancialEntryStatus::PROVISIONED, $filtersWithoutStatus),
            'estimated_costs' => $this->sumByNatureAndStatus(FinancialEntryNature::DEBIT, FinancialEntryStatus::PROVISIONED, $filtersWithoutStatus),
            'open_revenue' => $this->sumByNatureAndStatus(FinancialEntryNature::CREDIT, FinancialEntryStatus::OPEN, $filtersWithoutStatus),
            'open_costs' => $this->sumByNatureAndStatus(FinancialEntryNature::DEBIT, FinancialEntryStatus::OPEN, $filtersWithoutStatus),
            'paid_revenue' => $this->sumByNatureAndStatus(FinancialEntryNature::CREDIT, FinancialEntryStatus::PAID, $filtersWithoutStatus),
            'paid_costs' => $this->sumByNatureAndStatus(FinancialEntryNature::DEBIT, FinancialEntryStatus::PAID, $filtersWithoutStatus),
        ];
    }

    public function agingBuckets(?Carbon $referenceDate = null): array
    {
        $referenceDate ??= Carbon::today();

        $buckets = [
            '0-7' => ['amount' => 0, 'count' => 0],
            '8-15' => ['amount' => 0, 'count' => 0],
            '16-30' => ['amount' => 0, 'count' => 0],
            '30+' => ['amount' => 0, 'count' => 0],
        ];

        $entries = FinancialEntry::where('status', FinancialEntryStatus::OPEN->value)
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<', $referenceDate)
            ->get();

        foreach ($entries as $entry) {
            $days = Carbon::parse($entry->due_date)->diffInDays($referenceDate);

            if ($days <= 7) {
                $bucketKey = '0-7';
            } elseif ($days <= 15) {
                $bucketKey = '8-15';
            } elseif ($days <= 30) {
                $bucketKey = '16-30';
            } else {
                $bucketKey = '30+';
            }

            $buckets[$bucketKey]['amount'] += $this->amountValue($entry);
            $buckets[$bucketKey]['count']++;
        }

        return $buckets;
    }

    public function markOverdue(?Carbon $referenceDate = null): void
    {
        $referenceDate ??= Carbon::today();

        FinancialEntry::where('status', FinancialEntryStatus::OPEN->value)
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<', $referenceDate)
            ->update(['is_overdue' => true]);
    }

    private function applyFilters(Builder $query, array $filters): Builder
    {
        if (!empty($filters['source_type'])) {
            $query->where('source_type', $filters['source_type']);
        }

        if (!empty($filters['source_id'])) {
            $query->where('source_id', $filters['source_id']);
        }

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['vehicle_id'])) {
            $query->where('vehicle_id', $filters['vehicle_id']);
        }

        if (!empty($filters['client_id'])) {
            $query->where('client_id', $filters['client_id']);
        }

        if (!empty($filters['start_date'])) {
            $query->whereDate('entry_date', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('entry_date', '<=', $filters['end_date']);
        }

        if (!empty($filters['due_start'])) {
            $query->whereDate('due_date', '>=', $filters['due_start']);
        }

        if (!empty($filters['due_end'])) {
            $query->whereDate('due_date', '<=', $filters['due_end']);
        }

        return $query;
    }

    private function sumByNatureAndStatus(
        FinancialEntryNature $nature,
        FinancialEntryStatus $status,
        array $filters = []
    ): float {
        $query = FinancialEntry::query()
            ->where('nature', $nature->value)
            ->where('status', $status->value);

        $query = $this->applyFilters($query, $filters);

        $total = $query->selectRaw(
            'COALESCE(SUM(COALESCE(amount_converted, amount * COALESCE(NULLIF(exchange_rate, 0), 1))), 0) as total'
        )->value('total');

        return (float) $total;
    }

    private function amountValue(FinancialEntry $entry): float
    {
        if ($entry->amount_converted !== null) {
            return (float) $entry->amount_converted;
        }

        $rate = $entry->exchange_rate ?: 1;

        return round((float) $entry->amount * (float) $rate, 2);
    }
}
