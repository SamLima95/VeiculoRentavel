<?php

namespace App\Http\Resources;

use App\Enums\ReservationSource;
use App\Enums\ReservationStatus;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    private const STATUS_LABEL = [
        ReservationStatus::PENDING->value => 'Pendente',
        ReservationStatus::CONFIRMED->value => 'Confirmada',
        ReservationStatus::CANCELLED->value => 'Cancelada',
        ReservationStatus::COMPLETED->value => 'Concluida',
    ];

    private const SOURCE_LABEL = [
        ReservationSource::INTERNAL->value => 'Interno',
        ReservationSource::API->value => 'API',
        ReservationSource::PARTNER->value => 'Parceiro',
        ReservationSource::WALKIN->value => 'Balcao',
    ];

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'vehicle_id' => $this->vehicle_id,
            'client_id' => $this->client_id,
            'user_id' => $this->user_id,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'status' => $this->status instanceof ReservationStatus ? $this->status->value : $this->status,
            'status_label' => self::STATUS_LABEL[$this->status instanceof ReservationStatus ? $this->status->value : $this->status] ?? $this->status,
            'estimated_value' => $this->estimated_value,
            'source' => $this->source instanceof ReservationSource ? $this->source->value : $this->source,
            'source_label' => self::SOURCE_LABEL[$this->source instanceof ReservationSource ? $this->source->value : $this->source] ?? $this->source,
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
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
