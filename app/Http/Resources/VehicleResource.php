<?php

namespace App\Http\Resources;

use App\Enums\VehicleCategory;
use App\Enums\VehicleStatus;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class VehicleResource extends JsonResource
{
    /**
     * Map status to a human-friendly label for UI.
     */
    private function statusLabel(string $status): string
    {
        return [
            VehicleStatus::AVAILABLE->value => 'Disponível',
            VehicleStatus::RENTED->value => 'Locado',
            VehicleStatus::MAINTENANCE->value => 'Em Manutenção',
        ][$status] ?? $status;
    }

    /**
     * Map category to a human-friendly label for UI.
     */
    private function categoryLabel(?string $category): ?string
    {
        if (!$category) {
            return null;
        }

        return [
            VehicleCategory::COMPACT->value => 'Compacto',
            VehicleCategory::SEDAN->value => 'Sedan',
            VehicleCategory::SUV->value => 'SUV',
            VehicleCategory::PICKUP->value => 'Pickup',
            VehicleCategory::LUXURY->value => 'Luxo',
            VehicleCategory::HATCH->value => 'Hatch',
        ][$category] ?? $category;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        $category = $this->category instanceof VehicleCategory ? $this->category->value : $this->category;
        $status = $this->status instanceof VehicleStatus ? $this->status->value : $this->status;

        return [
            'id' => $this->id,
            'model' => $this->model,
            'brand' => $this->brand,
            'year' => $this->year,
            'color' => $this->color,
            'plate' => $this->plate,
            'mileage' => $this->mileage,
            'category' => $category,
            'category_label' => $this->categoryLabel($category),
            'status' => $status,
            'status_label' => $this->statusLabel($status),
            'renavam' => $this->renavam,
            'licensing_date' => $this->licensing_date,
            'ipva_date' => $this->ipva_date,
            'insurance_name' => $this->insurance_name,
            'policy_number' => $this->policy_number,
            'insurance_expiry' => $this->insurance_expiry,
            'claim_notes' => $this->claim_notes,
            'daily_rate' => $this->daily_rate,
            'notes' => $this->notes,
            'photo_path' => $this->photo_path,
            'photo_url' => $this->photo_path ? Storage::disk('public')->url($this->photo_path) : ($this->photo_url ?? null),
            'insurance_data' => $this->insurance_data,
            'reservations' => $this->whenLoaded('reservations'),
            'rentals' => $this->whenLoaded('rentals'),
            'maintenances' => $this->whenLoaded('maintenances'),
            'fines' => $this->whenLoaded('fines'),
            'stats' => $this->when(isset($this->stats), $this->stats),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
