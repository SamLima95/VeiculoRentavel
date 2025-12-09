<?php

namespace App\Services;

use App\Enums\FuelPolicy;
use App\Enums\RentalStatus;
use App\Models\Reservation;
use App\Models\Vehicle;
use Carbon\Carbon;

class RentalFactory
{
    public static function make(array $data, ?Vehicle $vehicle = null): array
    {
        $pickupDate = Carbon::parse($data['pickup_date']);
        $plannedReturn = Carbon::parse($data['planned_return_date']);

        $totalDays = max(1, (int) ceil($pickupDate->diffInMinutes($plannedReturn) / (60 * 24)));

        $dailyRate = $data['daily_rate'] ?? $vehicle?->daily_rate ?? 0;
        $extraKmRate = $data['extra_km_rate'] ?? 0;

        $payload = [
            'reservation_id' => $data['reservation_id'] ?? null,
            'vehicle_id' => $data['vehicle_id'],
            'client_id' => $data['client_id'],
            'user_id' => $data['user_id'],
            'pickup_date' => $pickupDate,
            'planned_return_date' => $plannedReturn,
            'return_date' => $data['return_date'] ?? null,
            'odometer_pickup' => $data['odometer_pickup'],
            'odometer_return' => $data['odometer_return'] ?? null,
            'fuel_pickup' => $data['fuel_pickup'] ?? null,
            'fuel_return' => $data['fuel_return'] ?? null,
            'initial_status' => $data['initial_status'] ?? null,
            'return_status' => $data['return_status'] ?? null,
            'photos_pickup' => $data['photos_pickup'] ?? null,
            'photos_return' => $data['photos_return'] ?? null,
            'checklist_pickup' => $data['checklist_pickup'] ?? null,
            'checklist_return' => $data['checklist_return'] ?? null,
            'damage_notes' => $data['damage_notes'] ?? null,
            'total_days' => $totalDays,
            'allowed_km_per_day' => $data['allowed_km_per_day'] ?? 100,
            'daily_rate' => $dailyRate,
            'extra_km' => $data['extra_km'] ?? 0,
            'extra_km_rate' => $extraKmRate,
            'late_fee_rate' => $data['late_fee_rate'] ?? 0,
            'late_fee_total' => $data['late_fee_total'] ?? 0,
            'cleaning_fee' => $data['cleaning_fee'] ?? 0,
            'fuel_policy' => $data['fuel_policy'] ?? FuelPolicy::FULL_TO_FULL->value,
            'fuel_charge' => $data['fuel_charge'] ?? 0,
            'damage_cost' => $data['damage_cost'] ?? 0,
            'extra_charges' => $data['extra_charges'] ?? 0,
            'discounts' => $data['discounts'] ?? 0,
            'subtotal' => $data['subtotal'] ?? round($totalDays * (float) $dailyRate, 2),
            'total' => $data['total'] ?? round($totalDays * (float) $dailyRate, 2),
            'status' => $data['status'] ?? RentalStatus::ACTIVE->value,
            'notes' => $data['notes'] ?? null,
            'created_by' => $data['created_by'] ?? null,
            'updated_by' => $data['updated_by'] ?? null,
        ];

        return $payload;
    }

    public static function fromReservation(Reservation $reservation, array $data): array
    {
        $payload = $data;
        $payload['reservation_id'] = $reservation->id;
        $payload['vehicle_id'] = $reservation->vehicle_id;
        $payload['client_id'] = $reservation->client_id;
        $payload['pickup_date'] = $data['pickup_date'] ?? $reservation->start_date;
        $payload['planned_return_date'] = $data['planned_return_date'] ?? $reservation->end_date;

        if (!isset($payload['user_id'])) {
            $payload['user_id'] = $reservation->user_id ?? $reservation->created_by;
        }

        return self::make($payload, $reservation->vehicle);
    }
}
