<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'vehicle_id' => ['required', 'integer', 'exists:vehicles,id'],
            'client_id' => ['required', 'integer', 'exists:clients,id'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date'],
            'estimated_value' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'source' => ['nullable', 'string', Rule::in(['internal', 'api', 'partner', 'walkin'])],
            'notes' => ['nullable', 'string', 'max:1000'],
            'confirm' => ['nullable', 'boolean'],
            'deposit_amount' => ['nullable', 'numeric', 'min:0.01'],
            'deposit_paid' => ['nullable', 'boolean'],
            'deposit_paid_at' => ['nullable', 'date'],
        ];
    }
}
