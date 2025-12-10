<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Get the latest user (the one created by the user) or create a default one if empty
        $user = User::latest()->first();

        if (! $user) {
            $user = User::factory()->create([
                'name' => 'Audri User',
                'email' => 'audri@example.com',
                'password' => Hash::make('password'),
            ]);
        }

        $this->command->info("Seeding data for user: {$user->name} ({$user->email})");

        // 2. Create Vehicles
        $vehicles = \App\Models\Vehicle::factory(10)->create();
        $this->command->info('Vehicles seeded.');

        // 3. Create Clients
        $clients = \App\Models\Client::factory(15)->create();
        $this->command->info('Clients seeded.');

        // 4. Create Reservations
        // We'll create some reservations for random clients and vehicles
        $reservations = \App\Models\Reservation::factory(20)
            ->recycle($vehicles)
            ->recycle($clients)
            ->create([
                'user_id' => $user->id,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ]);
        $this->command->info('Reservations seeded.');

        // 5. Create Rentals (Active and Completed)
        // Active rentals (from recent reservations)
        \App\Models\Rental::factory(5)
            ->recycle($vehicles)
            ->recycle($clients)
            ->create([
                'user_id' => $user->id,
                'created_by' => $user->id,
                'updated_by' => $user->id,
                'status' => \App\Enums\RentalStatus::ACTIVE,
            ]);

        // Completed rentals
        \App\Models\Rental::factory(10)
            ->recycle($vehicles)
            ->recycle($clients)
            ->create([
                'user_id' => $user->id,
                'created_by' => $user->id,
                'updated_by' => $user->id,
                'status' => \App\Enums\RentalStatus::COMPLETED,
                'return_date' => now(),
            ]);
        $this->command->info('Rentals seeded.');

        // 6. Create Maintenances
        \App\Models\Maintenance::factory(5)
            ->recycle($vehicles)
            ->create([
                'user_id' => $user->id,
            ]);
        $this->command->info('Maintenances seeded.');

        // 7. Create Financial Entries
        \App\Models\FinancialEntry::factory(20)
            ->recycle($vehicles)
            ->recycle($clients)
            ->create([
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ]);
        $this->command->info('Financial entries seeded.');
    }
}
