<?php

namespace App\Http\Resources;

use App\Enums\FuelPolicy;
use App\Enums\RentalStatus;
use Illuminate\Http\Resources\Json\JsonResource;

class RentalResource extends JsonResource
{
    private const STATUS_LABEL = [
        RentalStatus::ACTIVE->value => 'Ativa',
        RentalStatus::COMPLETED->value => 'Concluida',
        RentalStatus::CANCELLED->value => 'Cancelada',
    ];

    private const FUEL_POLICY_LABEL = [
        FuelPolicy::FULL_TO_FULL->value => 'Cheio para cheio',
        FuelPolicy::SAME_TO_SAME->value => 'Mesmo nivel',
        FuelPolicy::PREPAID->value => 'Pre-paga',
    ];

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        $status = $this->status instanceof RentalStatus ? $this->status->value : $this->status;
        $fuelPolicy = $this->fuel_policy instanceof FuelPolicy ? $this->fuel_policy->value : $this->fuel_policy;

        return [
            'id' => $this->id,
            'reservation_id' => $this->reservation_id,
            'vehicle_id' => $this->vehicle_id,
            'client_id' => $this->client_id,
            'user_id' => $this->user_id,
            'pickup_date' => $this->pickup_date,
            'planned_return_date' => $this->planned_return_date,
            'return_date' => $this->return_date,
            'odometer_pickup' => $this->odometer_pickup,
            'odometer_return' => $this->odometer_return,
            'fuel_pickup' => $this->fuel_pickup,
            'fuel_return' => $this->fuel_return,
            'fuel_policy' => $fuelPolicy,
            'fuel_policy_label' => self::FUEL_POLICY_LABEL[$fuelPolicy] ?? $fuelPolicy,
            'allowed_km_per_day' => $this->allowed_km_per_day,
            'daily_rate' => $this->daily_rate,
            'extra_km' => $this->extra_km,
            'extra_km_rate' => $this->extra_km_rate,
            'late_fee_rate' => $this->late_fee_rate,
            'late_fee_total' => $this->late_fee_total,
            'cleaning_fee' => $this->cleaning_fee,
            'fuel_charge' => $this->fuel_charge,
            'damage_cost' => $this->damage_cost,
            'extra_charges' => $this->extra_charges,
            'discounts' => $this->discounts,
            'subtotal' => $this->subtotal,
            'total' => $this->total,
            'photos_pickup' => $this->photos_pickup,
            'photos_return' => $this->photos_return,
            'checklist_pickup' => $this->checklist_pickup,
            'checklist_return' => $this->checklist_return,
            'damage_notes' => $this->damage_notes,
            'status' => $status,
            'status_label' => self::STATUS_LABEL[$status] ?? $status,
            'notes' => $this->notes,
            'vehicle' => $this->whenLoaded('vehicle', fn () => [
                'id' => $this->vehicle?->id,
                'model' => $this->vehicle?->model,
                'brand' => $this->vehicle?->brand,
                'plate' => $this->vehicle?->plate,
                'status' => $this->vehicle?->status,
            ]),
            'client' => $this->whenLoaded('client', fn () => [
                'id' => $this->client?->id,
                'name' => $this->client?->name ?? $this->client?->full_name ?? null,
                'document' => $this->client?->document ?? null,
            ]),
            'reservation' => $this->whenLoaded('reservation', fn () => [
                'id' => $this->reservation?->id,
                'status' => $this->reservation?->status,
                'start_date' => $this->reservation?->start_date,
                'end_date' => $this->reservation?->end_date,
            ]),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
