<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RentalDamageReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'damage_cost' => ['nullable', 'numeric', 'min:0'],
            'extra_charges' => ['nullable', 'numeric', 'min:0'],
            'damage_notes' => ['nullable', 'string', 'max:2000'],
            'photos_return' => ['nullable', 'array'],
            'checklist_return' => ['nullable', 'array'],
            'mark_maintenance' => ['nullable', 'boolean'],
            'close_rental' => ['nullable', 'boolean'],
            'return_date' => ['required_with:close_rental', 'nullable', 'date'],
            'odometer_return' => ['required_with:close_rental', 'nullable', 'integer', 'min:0'],
            'fuel_return' => ['required_with:close_rental', 'nullable', 'numeric', 'between:0,1'],
            'maintenance_end_date' => ['nullable', 'date'],
            'tank_capacity' => ['nullable', 'numeric', 'min:0'],
            'fuel_price' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
