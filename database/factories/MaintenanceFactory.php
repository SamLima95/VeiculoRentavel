<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Maintenance>
 */
class MaintenanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vehicle_id' => Vehicle::factory(),
            'user_id' => User::factory(),
            'type' => $this->faker->randomElement(['preventive', 'corrective']),
            'scheduled_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'cost' => $this->faker->randomFloat(2, 50, 1000),
            'provider' => $this->faker->company(),
            'description' => $this->faker->sentence(),
            'status' => 'scheduled',
            'notes' => $this->faker->optional()->paragraph(),
        ];
    }
}
