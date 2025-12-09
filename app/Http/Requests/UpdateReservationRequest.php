<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'start_date' => ['sometimes', 'required', 'date'],
            'end_date' => ['sometimes', 'required', 'date'],
            'estimated_value' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'source' => ['nullable', 'string', Rule::in(['internal', 'api', 'partner', 'walkin'])],
            'notes' => ['nullable', 'string', 'max:1000'],
            'deposit_amount' => ['nullable', 'numeric', 'min:0.01'],
            'deposit_paid' => ['nullable', 'boolean'],
            'deposit_paid_at' => ['nullable', 'date'],
        ];
    }
}
