<?php

namespace Database\Factories;

use App\Enums\FuelPolicy;
use App\Enums\RentalStatus;
use App\Models\Client;
use App\Models\Reservation;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Rental>
 */
class RentalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $pickupDate = $this->faker->dateTimeBetween('-1 month', 'now');
        $plannedReturnDate = clone $pickupDate;
        $plannedReturnDate->modify('+' . $this->faker->numberBetween(1, 10) . ' days');

        return [
            'reservation_id' => Reservation::factory(),
            'vehicle_id' => Vehicle::factory(),
            'client_id' => Client::factory(),
            'user_id' => User::factory(),
            'pickup_date' => $pickupDate,
            'planned_return_date' => $plannedReturnDate,
            'odometer_pickup' => $this->faker->numberBetween(10000, 50000),
            'fuel_pickup' => 1.0, // Full tank
            'initial_status' => 'No damages observed',
            'daily_rate' => $this->faker->randomFloat(2, 80, 200),
            'allowed_km_per_day' => 100,
            'extra_km_rate' => 0.50,
            'late_fee_rate' => 50.00,
            'cleaning_fee' => 0.00,
            'fuel_policy' => FuelPolicy::FULL_TO_FULL,
            'status' => RentalStatus::ACTIVE,
            'created_by' => User::factory(),
            'updated_by' => User::factory(),
        ];
    }
}
