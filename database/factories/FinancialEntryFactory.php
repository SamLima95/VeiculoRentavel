<?php

namespace Database\Factories;

use App\Enums\FinancialEntryNature;
use App\Enums\FinancialEntryStatus;
use App\Enums\FinancialEntryType;
use App\Models\Client;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FinancialEntry>
 */
class FinancialEntryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $amount = $this->faker->randomFloat(2, 10, 5000);

        return [
            'source_type' => 'manual',
            'vehicle_id' => Vehicle::factory(),
            'client_id' => Client::factory(),
            'nature' => $this->faker->randomElement(FinancialEntryNature::cases())->value,
            'type' => $this->faker->randomElement(FinancialEntryType::cases())->value,
            'amount' => $amount,
            'currency' => 'BRL',
            'exchange_rate' => 1.000000,
            'amount_converted' => $amount,
            'description' => $this->faker->sentence(),
            'entry_date' => $this->faker->date(),
            'due_date' => $this->faker->date(),
            'status' => FinancialEntryStatus::OPEN,
            'is_estimated' => false,
            'is_overdue' => false,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }
}
