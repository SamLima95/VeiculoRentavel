<?php

namespace App\Http\Requests;

use App\Enums\FuelPolicy;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRentalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reservation_id' => ['nullable', 'integer', 'exists:reservations,id'],
            'vehicle_id' => ['required', 'integer', 'exists:vehicles,id'],
            'client_id' => ['required', 'integer', 'exists:clients,id'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'pickup_date' => ['required', 'date'],
            'planned_return_date' => ['required', 'date', 'after:pickup_date'],
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
            'created_by' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }
}
