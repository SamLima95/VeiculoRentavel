<?php

namespace App\Http\Requests;

use App\Enums\VehicleCategory;
use App\Enums\VehicleStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateVehicleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // A autorizacao sera feita via middleware/policy
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $vehicleId = $this->route('vehicle') ?? $this->route('id');

        return [
            'model' => ['sometimes', 'required', 'string', 'max:255'],
            'brand' => ['sometimes', 'required', 'string', 'max:255'],
            'year' => ['sometimes', 'required', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'color' => ['sometimes', 'required', 'string', 'max:100'],
            'plate' => [
                'sometimes',
                'required',
                'string',
                'max:10',
                'regex:/^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d{1}[A-Z]\d{2}$/i',
                Rule::unique('vehicles', 'plate')
                    ->ignore($vehicleId)
                    ->whereNull('deleted_at'), // RN001 - Placa unica (exceto o proprio registro)
            ],
            'mileage' => ['sometimes', 'required', 'integer', 'min:0'],
            'category' => ['sometimes', 'required', new Enum(VehicleCategory::class)],
            'status' => ['sometimes', 'required', new Enum(VehicleStatus::class)],
            'renavam' => ['nullable', 'string', 'max:50'],
            'licensing_date' => ['nullable', 'date'],
            'ipva_date' => ['nullable', 'date'],
            'insurance_name' => ['nullable', 'string', 'max:255'],
            'policy_number' => ['nullable', 'string', 'max:255'],
            'insurance_expiry' => ['nullable', 'date'],
            'claim_notes' => ['nullable', 'string', 'max:1000'],
            'insurance_data' => ['nullable', 'array'],
            'insurance_data.name' => ['required_with:insurance_data', 'string', 'max:255'],
            'insurance_data.number' => ['nullable', 'string', 'max:255'],
            'insurance_data.expiry_date' => ['nullable', 'date'],
            'daily_rate' => ['sometimes', 'required', 'numeric', 'min:0', 'max:99999.99'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'plate.unique' => 'Esta placa ja esta cadastrada no sistema. (RN001 - Placa unica)',
            'plate.regex' => 'A placa deve estar no formato ABC1234, ABC-1234 ou ABC1D23 (Mercosul).',
            'year.min' => 'O ano deve ser valido.',
            'year.max' => 'O ano nao pode ser maior que ' . (date('Y') + 1) . '.',
            'daily_rate.min' => 'O valor da diaria deve ser maior ou igual a zero.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Normalizar placa removendo espacos e convertendo para maiusculas
        if ($this->has('plate')) {
            $this->merge([
                'plate' => strtoupper(str_replace([' ', '-'], '', $this->plate)),
            ]);
        }

        // Mapear status/categoria PT para o padrao interno
        $statusMap = [
            'disponivel' => VehicleStatus::AVAILABLE->value,
            'disponível' => VehicleStatus::AVAILABLE->value,
            'locado' => VehicleStatus::RENTED->value,
            'manutencao' => VehicleStatus::MAINTENANCE->value,
            'manutenção' => VehicleStatus::MAINTENANCE->value,
        ];

        $categoryMap = [
            'compacto' => VehicleCategory::COMPACT->value,
            'sedan' => VehicleCategory::SEDAN->value,
            'suv' => VehicleCategory::SUV->value,
            'pickup' => VehicleCategory::PICKUP->value,
            'luxo' => VehicleCategory::LUXURY->value,
            'hatch' => VehicleCategory::HATCH->value,
        ];

        if ($this->has('status')) {
            $statusKey = mb_strtolower((string) $this->status);
            $this->merge([
                'status' => $statusMap[$statusKey] ?? $this->status,
            ]);
        }

        if ($this->has('category')) {
            $categoryKey = mb_strtolower((string) $this->category);
            $this->merge([
                'category' => $categoryMap[$categoryKey] ?? $this->category,
            ]);
        }

        // Garantir que mileage seja um inteiro
        if ($this->has('mileage')) {
            $this->merge([
                'mileage' => (int) $this->mileage,
            ]);
        }

        // Garantir que daily_rate seja um numero
        if ($this->has('daily_rate')) {
            $this->merge([
                'daily_rate' => (float) $this->daily_rate,
            ]);
        }
    }
}
