<?php

namespace App\Http\Requests;

use App\Enums\FinancialEntryNature;
use App\Enums\FinancialEntryStatus;
use App\Enums\FinancialEntryType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFinancialEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'source_type' => ['nullable', 'string', Rule::in(['rental', 'reservation', 'maintenance', 'manual'])],
            'source_id' => ['nullable', 'integer'],
            'vehicle_id' => ['nullable', 'integer', 'exists:vehicles,id'],
            'client_id' => ['nullable', 'integer', 'exists:clients,id'],
            'nature' => ['required', 'string', Rule::in(FinancialEntryNature::values())],
            'type' => ['required', 'string', Rule::in(FinancialEntryType::values())],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'currency' => ['nullable', 'string', 'size:3'],
            'exchange_rate' => ['nullable', 'numeric', 'min:0.000001'],
            'description' => ['nullable', 'string', 'max:1000'],
            'entry_date' => ['required', 'date'],
            'due_date' => ['nullable', 'date', 'after_or_equal:entry_date'],
            'paid_at' => ['nullable', 'date'],
            'status' => ['nullable', 'string', Rule::in(FinancialEntryStatus::values())],
            'is_estimated' => ['nullable', 'boolean'],
            'is_overdue' => ['nullable', 'boolean'],
        ];
    }
}
