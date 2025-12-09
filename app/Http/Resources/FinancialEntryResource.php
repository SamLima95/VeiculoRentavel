<?php

namespace App\Http\Resources;

use App\Enums\FinancialEntryNature;
use App\Enums\FinancialEntryStatus;
use App\Enums\FinancialEntryType;
use Illuminate\Http\Resources\Json\JsonResource;

class FinancialEntryResource extends JsonResource
{
    private const STATUS_LABEL = [
        FinancialEntryStatus::PROVISIONED->value => 'Provisionado',
        FinancialEntryStatus::OPEN->value => 'Em aberto',
        FinancialEntryStatus::PAID->value => 'Pago',
        FinancialEntryStatus::CANCELLED->value => 'Cancelado',
    ];

    private const NATURE_LABEL = [
        FinancialEntryNature::CREDIT->value => 'Credito',
        FinancialEntryNature::DEBIT->value => 'Debito',
    ];

    private const TYPE_LABEL = [
        FinancialEntryType::RENTAL_DAILY->value => 'Diarias',
        FinancialEntryType::RENTAL_EXTRA_KM->value => 'Km extra',
        FinancialEntryType::RENTAL_LATE_FEE->value => 'Multa atraso',
        FinancialEntryType::RENTAL_FUEL->value => 'Combustivel',
        FinancialEntryType::RENTAL_CLEANING->value => 'Limpeza',
        FinancialEntryType::RENTAL_DAMAGE->value => 'Danos',
        FinancialEntryType::RENTAL_DISCOUNT->value => 'Descontos',
        FinancialEntryType::RENTAL_EXTRA_CHARGES->value => 'Extras',
        FinancialEntryType::MAINTENANCE_COST->value => 'Custo manutencao',
        FinancialEntryType::FINE->value => 'Multa',
        FinancialEntryType::MANUAL_ADJUSTMENT->value => 'Ajuste manual',
        FinancialEntryType::RESERVATION_DEPOSIT->value => 'Sinal de reserva',
    ];

    public function toArray($request): array
    {
        $status = $this->status instanceof FinancialEntryStatus ? $this->status->value : $this->status;
        $nature = $this->nature instanceof FinancialEntryNature ? $this->nature->value : $this->nature;
        $type = $this->type instanceof FinancialEntryType ? $this->type->value : $this->type;

        return [
            'id' => $this->id,
            'source_type' => $this->source_type,
            'source_id' => $this->source_id,
            'vehicle_id' => $this->vehicle_id,
            'client_id' => $this->client_id,
            'nature' => $nature,
            'nature_label' => self::NATURE_LABEL[$nature] ?? $nature,
            'type' => $type,
            'type_label' => self::TYPE_LABEL[$type] ?? $type,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'exchange_rate' => $this->exchange_rate,
            'amount_converted' => $this->amount_converted ?? $this->amount,
            'description' => $this->description,
            'entry_date' => $this->entry_date,
            'due_date' => $this->due_date,
            'paid_at' => $this->paid_at,
            'status' => $status,
            'status_label' => self::STATUS_LABEL[$status] ?? $status,
            'is_estimated' => (bool) $this->is_estimated,
            'is_overdue' => (bool) $this->is_overdue,
            'vehicle' => $this->whenLoaded('vehicle', fn () => [
                'id' => $this->vehicle?->id,
                'model' => $this->vehicle?->model,
                'plate' => $this->vehicle?->plate,
            ]),
            'client' => $this->whenLoaded('client', fn () => [
                'id' => $this->client?->id,
                'name' => $this->client?->name ?? $this->client?->full_name ?? null,
                'document' => $this->client?->document ?? null,
            ]),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
