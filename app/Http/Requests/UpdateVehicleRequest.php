<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVehicleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // A autorização será feita via middleware/policy
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
                    ->whereNull('deleted_at') // RN001 - Placa única (exceto o próprio registro)
            ],
            'mileage' => ['sometimes', 'required', 'integer', 'min:0'],
            'category' => ['sometimes', 'required', 'string', 'in:Econômico,Intermediário,Executivo,SUV'],
            'status' => ['sometimes', 'required', 'string', 'in:available,rented,maintenance'],
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
            'plate.unique' => 'Esta placa já está cadastrada no sistema. (RN001 - Placa Única)',
            'plate.regex' => 'A placa deve estar no formato ABC1234, ABC-1234 ou ABC1D23 (Mercosul).',
            'year.min' => 'O ano deve ser válido.',
            'year.max' => 'O ano não pode ser maior que ' . (date('Y') + 1) . '.',
            'daily_rate.min' => 'O valor da diária deve ser maior ou igual a zero.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Normalizar placa removendo espaços e convertendo para maiúsculas
        if ($this->has('plate')) {
            $this->merge([
                'plate' => strtoupper(str_replace([' ', '-'], '', $this->plate)),
            ]);
        }

        // Garantir que mileage seja um inteiro
        if ($this->has('mileage')) {
            $this->merge([
                'mileage' => (int) $this->mileage,
            ]);
        }

        // Garantir que daily_rate seja um número
        if ($this->has('daily_rate')) {
            $this->merge([
                'daily_rate' => (float) $this->daily_rate,
            ]);
        }
    }
}
