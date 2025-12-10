<?php

namespace Database\Factories;

use App\Enums\ReservationSource;
use App\Enums\ReservationStatus;
use App\Models\Client;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('now', '+1 month');
        $endDate = clone $startDate;
        $endDate->modify('+' . $this->faker->numberBetween(1, 15) . ' days');

        return [
            'vehicle_id' => Vehicle::factory(),
            'client_id' => Client::factory(),
            'user_id' => User::factory(),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => ReservationStatus::CONFIRMED,
            'estimated_value' => $this->faker->randomFloat(2, 100, 2000),
            'source' => ReservationSource::WALKIN,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}
