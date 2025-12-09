<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RentalCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'return_date' => ['required', 'date'],
            'odometer_return' => ['required', 'integer', 'min:0'],
            'fuel_return' => ['required', 'numeric', 'between:0,1'],
            'damage_cost' => ['nullable', 'numeric', 'min:0'],
            'extra_charges' => ['nullable', 'numeric', 'min:0'],
            'discounts' => ['nullable', 'numeric', 'min:0'],
            'tank_capacity' => ['nullable', 'numeric', 'min:0'],
            'fuel_price' => ['nullable', 'numeric', 'min:0'],
            'mark_maintenance' => ['nullable', 'boolean'],
            'maintenance_end_date' => ['nullable', 'date', 'after_or_equal:return_date'],
            'photos_return' => ['nullable', 'array'],
            'checklist_return' => ['nullable', 'array'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'mark_as_paid' => ['nullable', 'boolean'],
            'paid_at' => ['nullable', 'date'],
        ];
    }
}
