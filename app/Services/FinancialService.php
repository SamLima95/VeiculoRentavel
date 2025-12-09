<?php

namespace App\Services;

use App\Enums\FinancialEntryNature;
use App\Enums\FinancialEntryStatus;
use App\Enums\FinancialEntryType;
use App\Models\FinancialEntry;
use App\Models\Maintenance;
use App\Models\Rental;
use App\Models\Reservation;
use App\Repositories\FinancialRepository;
use Carbon\Carbon;
use DomainException;

class FinancialService
{
    public function __construct(private readonly FinancialRepository $repository)
    {
    }

    public function create(array $data): FinancialEntry
    {
        $payload = $this->preparePayload($data);

        return FinancialEntry::create($payload);
    }

    public function update(FinancialEntry $entry, array $data): FinancialEntry
    {
        $this->assertEditable($entry, $data);

        $payload = $this->preparePayload(array_merge($entry->toArray(), $data), $entry);

        $entry->fill([
            'description' => $payload['description'],
            'entry_date' => $payload['entry_date'],
            'due_date' => $payload['due_date'],
            'paid_at' => $payload['paid_at'],
            'status' => $payload['status'],
            'is_estimated' => $payload['is_estimated'],
            'is_overdue' => $payload['is_overdue'],
            'currency' => $payload['currency'],
            'exchange_rate' => $payload['exchange_rate'],
            'amount_converted' => $payload['amount_converted'],
        ]);

        if ($entry->source_type === 'manual') {
            $entry->fill([
                'amount' => $payload['amount'],
                'nature' => $payload['nature'],
                'type' => $payload['type'],
            ]);
        }

        $entry->save();

        return $entry;
    }

    public function pay(FinancialEntry $entry, array $data = []): FinancialEntry
    {
        if ($entry->status === FinancialEntryStatus::CANCELLED) {
            throw new DomainException('Lancamento cancelado nao pode ser pago.');
        }

        $paidAt = !empty($data['paid_at']) ? Carbon::parse($data['paid_at']) : Carbon::now();

        $entry->status = FinancialEntryStatus::PAID->value;
        $entry->paid_at = $paidAt;
        $entry->is_overdue = false;
        $entry->is_estimated = false;
        $entry->amount_converted = $this->computeConvertedAmount([
            'amount' => $entry->amount,
            'currency' => $entry->currency,
            'exchange_rate' => $entry->exchange_rate,
        ]);
        $entry->save();

        return $entry;
    }

    public function cancel(FinancialEntry $entry, bool $createReversal = false): FinancialEntry
    {
        $wasPaid = $entry->status === FinancialEntryStatus::PAID;

        $entry->status = FinancialEntryStatus::CANCELLED->value;
        $entry->is_overdue = false;
        $entry->save();

        if ($createReversal && $wasPaid) {
            $this->createReversal($entry);
        }

        return $entry;
    }

    public function provisionRental(Rental $rental): void
    {
        $entryDate = $rental->pickup_date ? Carbon::parse($rental->pickup_date)->toDateString() : Carbon::today()->toDateString();
        $dueDate = $rental->planned_return_date ? Carbon::parse($rental->planned_return_date)->toDateString() : null;
        $days = $rental->calculateTotalDays();

        $this->upsertEntry([
            'source_type' => 'rental',
            'source_id' => $rental->id,
            'vehicle_id' => $rental->vehicle_id,
            'client_id' => $rental->client_id,
            'nature' => FinancialEntryNature::CREDIT->value,
            'type' => FinancialEntryType::RENTAL_DAILY->value,
            'amount' => round($days * (float) $rental->daily_rate, 2),
            'entry_date' => $entryDate,
            'due_date' => $dueDate,
            'status' => FinancialEntryStatus::PROVISIONED->value,
            'is_estimated' => true,
            'description' => 'Diarias provisionadas',
        ]);

        if ((float) $rental->cleaning_fee > 0) {
            $this->upsertEntry([
                'source_type' => 'rental',
                'source_id' => $rental->id,
                'vehicle_id' => $rental->vehicle_id,
                'client_id' => $rental->client_id,
                'nature' => FinancialEntryNature::CREDIT->value,
                'type' => FinancialEntryType::RENTAL_CLEANING->value,
                'amount' => (float) $rental->cleaning_fee,
                'entry_date' => $entryDate,
                'due_date' => $dueDate,
                'status' => FinancialEntryStatus::PROVISIONED->value,
                'is_estimated' => true,
                'description' => 'Taxa de limpeza provisionada',
            ]);
        }
    }

    public function reconcileRental(Rental $rental, bool $markPaid = false, ?Carbon $paidAt = null): void
    {
        $paidAt = $markPaid ? ($paidAt ?? Carbon::now()) : null;
        $status = $markPaid ? FinancialEntryStatus::PAID->value : FinancialEntryStatus::OPEN->value;
        $entryDate = $rental->return_date
            ? Carbon::parse($rental->return_date)->toDateString()
            : Carbon::today()->toDateString();
        $dueDate = $rental->planned_return_date
            ? Carbon::parse($rental->planned_return_date)->toDateString()
            : $entryDate;

        $days = $rental->calculateTotalDays();
        $this->upsertEntry([
            'source_type' => 'rental',
            'source_id' => $rental->id,
            'vehicle_id' => $rental->vehicle_id,
            'client_id' => $rental->client_id,
            'nature' => FinancialEntryNature::CREDIT->value,
            'type' => FinancialEntryType::RENTAL_DAILY->value,
            'amount' => round($days * (float) $rental->daily_rate, 2),
            'entry_date' => $entryDate,
            'due_date' => $dueDate,
            'status' => $status,
            'paid_at' => $paidAt,
            'is_estimated' => false,
            'description' => 'Diarias apuradas no checkout',
        ]);

        $this->syncComponentEntry($rental, FinancialEntryType::RENTAL_EXTRA_KM, (float) $rental->extra_km * (float) $rental->extra_km_rate, $status, $paidAt, $entryDate, $dueDate, 'Km extra');
        $this->syncComponentEntry($rental, FinancialEntryType::RENTAL_LATE_FEE, (float) $rental->late_fee_total, $status, $paidAt, $entryDate, $dueDate, 'Multa por atraso');
        $this->syncComponentEntry($rental, FinancialEntryType::RENTAL_FUEL, (float) $rental->fuel_charge, $status, $paidAt, $entryDate, $dueDate, 'Taxa de combustivel');
        $this->syncComponentEntry($rental, FinancialEntryType::RENTAL_CLEANING, (float) $rental->cleaning_fee, $status, $paidAt, $entryDate, $dueDate, 'Taxa de limpeza');
        $this->syncComponentEntry($rental, FinancialEntryType::RENTAL_DAMAGE, (float) $rental->damage_cost, $status, $paidAt, $entryDate, $dueDate, 'Danos', nature: FinancialEntryNature::CREDIT);
        $this->syncComponentEntry($rental, FinancialEntryType::RENTAL_EXTRA_CHARGES, (float) $rental->extra_charges, $status, $paidAt, $entryDate, $dueDate, 'Extras diversos');
        $this->syncComponentEntry($rental, FinancialEntryType::RENTAL_DISCOUNT, (float) $rental->discounts, $status, $paidAt, $entryDate, $dueDate, 'Descontos', nature: FinancialEntryNature::DEBIT);
    }

    public function cancelBySource(string $sourceType, int $sourceId): void
    {
        $this->repository->cancelBySource($sourceType, $sourceId);
    }

    public function reclassifyReservation(Reservation $reservation, Rental $rental): void
    {
        $entries = $this->repository->bySource('reservation', $reservation->id);

        foreach ($entries as $entry) {
            $typeValue = $entry->type instanceof FinancialEntryType ? $entry->type->value : $entry->type;
            $this->cancel($entry);

            if ($typeValue === FinancialEntryType::RESERVATION_DEPOSIT->value) {
                $this->upsertEntry([
                    'source_type' => 'rental',
                    'source_id' => $rental->id,
                    'vehicle_id' => $rental->vehicle_id,
                    'client_id' => $rental->client_id,
                    'nature' => $entry->nature instanceof FinancialEntryNature ? $entry->nature->value : $entry->nature,
                    'type' => FinancialEntryType::RESERVATION_DEPOSIT->value,
                    'amount' => (float) $entry->amount,
                    'entry_date' => $entry->entry_date,
                    'due_date' => $entry->due_date,
                    'status' => $entry->status instanceof FinancialEntryStatus ? $entry->status->value : $entry->status,
                    'paid_at' => $entry->paid_at,
                    'is_estimated' => $entry->is_estimated,
                    'description' => 'Reclassificacao de sinal da reserva',
                ]);
            }
        }
    }

    public function registerReservationDeposit(
        Reservation $reservation,
        float $amount,
        bool $paid = false,
        ?Carbon $paidAt = null
    ): FinancialEntry {
        $status = $paid ? FinancialEntryStatus::PAID->value : FinancialEntryStatus::OPEN->value;

        return $this->upsertEntry([
            'source_type' => 'reservation',
            'source_id' => $reservation->id,
            'vehicle_id' => $reservation->vehicle_id,
            'client_id' => $reservation->client_id,
            'nature' => FinancialEntryNature::CREDIT->value,
            'type' => FinancialEntryType::RESERVATION_DEPOSIT->value,
            'amount' => $amount,
            'entry_date' => $reservation->start_date ? Carbon::parse($reservation->start_date)->toDateString() : Carbon::today()->toDateString(),
            'due_date' => $reservation->start_date ? Carbon::parse($reservation->start_date)->toDateString() : null,
            'status' => $status,
            'paid_at' => $paid ? ($paidAt ?? Carbon::now()) : null,
            'is_estimated' => !$paid,
            'description' => 'Sinal da reserva',
        ]);
    }

    public function registerMaintenanceCost(Maintenance $maintenance, bool $markPaid = false): ?FinancialEntry
    {
        $amount = (float) ($maintenance->cost ?? 0);
        if ($amount <= 0) {
            return null;
        }

        $status = $markPaid ? FinancialEntryStatus::PAID->value : FinancialEntryStatus::OPEN->value;
        $paidAt = $markPaid ? Carbon::now() : null;

        return $this->upsertEntry([
            'source_type' => 'maintenance',
            'source_id' => $maintenance->id,
            'vehicle_id' => $maintenance->vehicle_id,
            'nature' => FinancialEntryNature::DEBIT->value,
            'type' => FinancialEntryType::MAINTENANCE_COST->value,
            'amount' => $amount,
            'entry_date' => $maintenance->completed_date ?? $maintenance->scheduled_date ?? Carbon::today()->toDateString(),
            'due_date' => $maintenance->scheduled_date,
            'status' => $status,
            'paid_at' => $paidAt,
            'is_estimated' => !$markPaid,
            'description' => $maintenance->description ?? 'Custo de manutencao',
        ]);
    }

    private function upsertEntry(array $data, ?FinancialEntry $existing = null): FinancialEntry
    {
        $payload = $this->preparePayload($data, $existing);

        $entry = $existing;
        if (!$entry) {
            $entry = $this->repository->findByKey(
                $payload['source_type'],
                $payload['source_id'],
                $payload['type']
            );
        }

        if (!$entry) {
            return FinancialEntry::create($payload);
        }

        // If still provisioned, allow transition to actual; otherwise keep immutability.
        if ($entry->status === FinancialEntryStatus::PROVISIONED && $payload['status'] !== FinancialEntryStatus::PROVISIONED->value) {
            $entry->status = $payload['status'];
            $entry->is_estimated = $payload['is_estimated'];
            $entry->paid_at = $payload['paid_at'];
            $entry->entry_date = $payload['entry_date'];
            $entry->due_date = $payload['due_date'];
            $entry->amount = $payload['amount'];
            $entry->amount_converted = $payload['amount_converted'];
            $entry->currency = $payload['currency'];
            $entry->exchange_rate = $payload['exchange_rate'];
            $entry->description = $payload['description'];
            $entry->nature = $payload['nature'];
        } else {
            $this->assertEditable($entry, $payload);
            $entry->fill([
                'description' => $payload['description'],
                'entry_date' => $payload['entry_date'],
                'due_date' => $payload['due_date'],
                'status' => $payload['status'],
                'paid_at' => $payload['paid_at'],
                'is_estimated' => $payload['is_estimated'],
                'amount_converted' => $payload['amount_converted'],
                'is_overdue' => $payload['is_overdue'],
                'currency' => $payload['currency'],
                'exchange_rate' => $payload['exchange_rate'],
            ]);
        }

        $entry->save();

        return $entry;
    }

    private function preparePayload(array $data, ?FinancialEntry $existing = null): array
    {
        $payload = $data;
        $payload['source_type'] = $payload['source_type'] ?? 'manual';
        $payload['status'] = $payload['status'] ?? FinancialEntryStatus::PROVISIONED->value;
        $payload['entry_date'] = Carbon::parse($payload['entry_date'] ?? Carbon::today())->toDateString();
        $payload['due_date'] = !empty($payload['due_date']) ? Carbon::parse($payload['due_date'])->toDateString() : null;
        $payload['paid_at'] = !empty($payload['paid_at']) ? Carbon::parse($payload['paid_at']) : null;
        $payload['currency'] = strtoupper($payload['currency'] ?? 'BRL');
        $payload['is_estimated'] = $payload['is_estimated'] ?? ($payload['status'] === FinancialEntryStatus::PROVISIONED->value);
        $payload['is_overdue'] = $payload['is_overdue'] ?? false;

        if (empty($payload['type']) || !in_array($payload['type'], FinancialEntryType::values(), true)) {
            throw new DomainException('Tipo de lancamento invalido.');
        }

        if (empty($payload['nature']) || !in_array($payload['nature'], FinancialEntryNature::values(), true)) {
            throw new DomainException('Natureza de lancamento invalida.');
        }

        $amount = (float) ($payload['amount'] ?? $existing?->amount ?? 0);
        if ($amount <= 0) {
            throw new DomainException('amount precisa ser positivo.');
        }

        if ($payload['currency'] !== 'BRL' && empty($payload['exchange_rate'])) {
            throw new DomainException('exchange_rate e obrigatorio para moeda diferente de BRL.');
        }

        $payload['amount'] = $amount;
        $payload['amount_converted'] = $this->computeConvertedAmount($payload);

        return $payload;
    }

    private function computeConvertedAmount(array $payload): float
    {
        $rate = $payload['currency'] !== 'BRL'
            ? (float) ($payload['exchange_rate'] ?? 0)
            : 1;

        if ($rate <= 0) {
            $rate = 1;
        }

        return round((float) $payload['amount'] * $rate, 2);
    }

    private function assertEditable(FinancialEntry $entry, array $data): void
    {
        $isAutomatic = $entry->isAutomatic();

        if ($isAutomatic) {
            if (isset($data['source_type']) && $data['source_type'] !== $entry->source_type) {
                throw new DomainException('source_type nao pode ser alterado para lancamentos automaticos.');
            }

            if (isset($data['source_id']) && (int) $data['source_id'] !== (int) $entry->source_id) {
                throw new DomainException('source_id nao pode ser alterado para lancamentos automaticos.');
            }

            if (isset($data['nature']) && $data['nature'] !== $entry->nature?->value) {
                throw new DomainException('nature nao pode ser alterada para lancamentos automaticos.');
            }

            if (isset($data['type']) && $data['type'] !== $entry->type?->value) {
                throw new DomainException('type nao pode ser alterado para lancamentos automaticos.');
            }

            if (
                isset($data['amount'])
                && round((float) $data['amount'], 2) !== round((float) $entry->amount, 2)
                && $entry->status !== FinancialEntryStatus::PROVISIONED
            ) {
                throw new DomainException('amount nao pode ser alterado para lancamentos automaticos apos provisionamento.');
            }
        }
    }

    private function syncComponentEntry(
        Rental $rental,
        FinancialEntryType $type,
        float $amount,
        string $status,
        ?Carbon $paidAt,
        string $entryDate,
        ?string $dueDate,
        string $description,
        FinancialEntryNature $nature = FinancialEntryNature::CREDIT
    ): void {
        if ($amount <= 0) {
            $existing = $this->repository->findByKey('rental', $rental->id, $type);
            if ($existing) {
                $this->cancel($existing);
            }

            return;
        }

        $this->upsertEntry([
            'source_type' => 'rental',
            'source_id' => $rental->id,
            'vehicle_id' => $rental->vehicle_id,
            'client_id' => $rental->client_id,
            'nature' => $nature->value,
            'type' => $type->value,
            'amount' => $amount,
            'entry_date' => $entryDate,
            'due_date' => $dueDate,
            'status' => $status,
            'paid_at' => $paidAt,
            'is_estimated' => false,
            'description' => $description,
        ]);
    }

    private function createReversal(FinancialEntry $entry): void
    {
        $reverseNature = $entry->nature === FinancialEntryNature::CREDIT
            ? FinancialEntryNature::DEBIT->value
            : FinancialEntryNature::CREDIT->value;
        $convertedAmount = $entry->amount_converted ?? $this->computeConvertedAmount([
            'amount' => $entry->amount,
            'currency' => $entry->currency,
            'exchange_rate' => $entry->exchange_rate,
        ]);

        FinancialEntry::create([
            'source_type' => 'manual',
            'source_id' => null,
            'vehicle_id' => $entry->vehicle_id,
            'client_id' => $entry->client_id,
            'nature' => $reverseNature,
            'type' => FinancialEntryType::MANUAL_ADJUSTMENT->value,
            'amount' => $entry->amount,
            'currency' => $entry->currency,
            'exchange_rate' => $entry->exchange_rate,
            'amount_converted' => $convertedAmount,
            'description' => 'Estorno do lancamento #'.$entry->id,
            'entry_date' => Carbon::today()->toDateString(),
            'due_date' => Carbon::today()->toDateString(),
            'status' => FinancialEntryStatus::OPEN->value,
            'is_estimated' => false,
        ]);
    }
}
