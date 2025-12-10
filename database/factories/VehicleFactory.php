<?php

namespace Database\Factories;

use App\Enums\VehicleCategory;
use App\Enums\VehicleStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vehicle>
 */
class VehicleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'model' => $this->faker->word(),
            'brand' => $this->faker->company(),
            'year' => $this->faker->year(),
            'color' => $this->faker->safeColorName(),
            'plate' => strtoupper($this->faker->bothify('???-####')),
            'mileage' => $this->faker->numberBetween(1000, 100000),
            'category' => $this->faker->randomElement(VehicleCategory::cases()),
            'status' => VehicleStatus::AVAILABLE,
            'renavam' => $this->faker->numerify('###########'),
            'licensing_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'ipva_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'insurance_name' => $this->faker->company(),
            'policy_number' => $this->faker->numerify('##########'),
            'insurance_expiry' => $this->faker->dateTimeBetween('now', '+1 year'),
            'claim_notes' => $this->faker->optional()->sentence(),
            'daily_rate' => $this->faker->randomFloat(2, 50, 300),
            'notes' => $this->faker->optional()->paragraph(),
        ];
    }
}
