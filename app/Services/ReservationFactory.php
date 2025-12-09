<?php

namespace App\Services;

use App\Enums\ReservationSource;
use App\Enums\ReservationStatus;
use Carbon\Carbon;

class ReservationFactory
{
    public static function make(array $data): array
    {
        $start = Carbon::parse($data['start_date']);
        $end = Carbon::parse($data['end_date']);

        return [
            'vehicle_id' => $data['vehicle_id'],
            'client_id' => $data['client_id'],
            'user_id' => $data['user_id'] ?? null,
            'start_date' => $start,
            'end_date' => $end,
            'status' => ReservationStatus::PENDING->value,
            'estimated_value' => $data['estimated_value'] ?? null,
            'source' => $data['source'] ?? ReservationSource::INTERNAL->value,
            'notes' => $data['notes'] ?? null,
            'created_by' => $data['created_by'] ?? ($data['user_id'] ?? null),
            'updated_by' => $data['updated_by'] ?? ($data['user_id'] ?? null),
        ];
    }
}
