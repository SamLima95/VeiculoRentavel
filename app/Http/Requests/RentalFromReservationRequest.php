<?php

namespace App\Http\Requests;

use App\Enums\FuelPolicy;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RentalFromReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reservation_id' => ['required', 'integer', 'exists:reservations,id'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'pickup_date' => ['nullable', 'date'],
            'planned_return_date' => ['nullable', 'date'],
            'odometer_pickup' => ['required', 'integer', 'min:0'],
            'fuel_pickup' => ['required', 'numeric', 'between:0,1'],
            'allowed_km_per_day' => ['nullable', 'integer', 'min:0'],
            'daily_rate' => ['nullable', 'numeric', 'min:0'],
            'extra_km_rate' => ['nullable', 'numeric', 'min:0'],
            'late_fee_rate' => ['nullable', 'numeric', 'min:0'],
            'cleaning_fee' => ['nullable', 'numeric', 'min:0'],
            'fuel_policy' => ['nullable', 'string', Rule::in(FuelPolicy::values())],
            'photos_pickup' => ['nullable', 'array'],
            'checklist_pickup' => ['nullable', 'array'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
