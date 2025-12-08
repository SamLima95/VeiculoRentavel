<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\VehicleRental\DashboardController;
use App\Http\Controllers\VehicleRental\VehicleController;
use App\Http\Controllers\VehicleRental\ClientController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Rotas do módulo de aluguel de veículos
    Route::resource('vehicles', VehicleController::class);
    Route::post('vehicles/{vehicle}/inactivate', [VehicleController::class, 'inactivate'])->name('vehicles.inactivate');
    Route::get('vehicles/check-plate', [VehicleController::class, 'checkPlateAvailability'])->name('vehicles.check-plate');

    Route::get('clients', function () {
        return Inertia::render('clients', [
            'clients' => [
                'data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 10,
                'total' => 0,
                'from' => 0,
                'to' => 0,
                'links' => [],
            ],
        ]);
    })->name('clients');

    Route::get('clients/create', function () {
        return Inertia::render('clients/create');
    })->name('clients.create');

    Route::get('vehicles/maintenance', function () {
        return Inertia::render('vehicles/maintenance', [
            'maintenances' => [
                'data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 10,
                'total' => 0,
                'links' => [],
            ],
        ]);
    })->name('vehicles.maintenance');

    Route::get('vehicles/maintenance/create', function () {
        return Inertia::render('vehicles/maintenance', [
            'maintenances' => [
                'data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 10,
                'total' => 0,
                'links' => [],
            ],
        ]);
    })->name('vehicles.maintenance.create');

    Route::get('vehicles/maintenance/{id}/edit', function () {
        return Inertia::render('vehicles/maintenance', [
            'maintenances' => [
                'data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 10,
                'total' => 0,
                'links' => [],
            ],
        ]);
    })->name('vehicles.maintenance.edit');

    Route::get('reservations', function () {
        return Inertia::render('reservations', [
            'reservations' => [
                'data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 10,
                'total' => 0,
                'from' => 0,
                'to' => 0,
                'links' => [],
            ],
        ]);
    })->name('reservations');

    Route::get('reservations/create', function () {
        return Inertia::render('reservations/create', [
            'vehicles' => [],
            'clients' => [],
        ]);
    })->name('reservations.create');

    Route::get('rentals', function () {
        return Inertia::render('rentals', [
            'rentals' => [
                'data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 10,
                'total' => 0,
                'from' => 0,
                'to' => 0,
                'links' => [],
            ],
            'stats' => [
                'in_progress' => 0,
                'overdue' => 0,
                'finished_month' => 0,
                'revenue_estimated' => 0,
            ],
        ]);
    })->name('rentals');

    Route::get('rentals/check-in', function () {
        return Inertia::render('rentals/check-in', [
            'reservation' => [
                'client' => 'João da Silva',
                'vehicle' => 'Volkswagen Nivus',
                'plate' => 'ABC-1234',
                'period' => '13/10/2024 - 15/10/2024',
                'category' => 'SUV Compacto',
                'image' => 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900',
            ],
        ]);
    })->name('rentals.checkin');

    Route::get('rentals/check-out', function () {
        return Inertia::render('rentals/check-out');
    })->name('rentals.checkout');

    Route::get('finance', function () {
        return Inertia::render('finance');
    })->name('finance');

    Route::get('admin', function () {
        return Inertia::render('admin');
    })->name('admin');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

// Tariffs configuration (placeholder)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('settings/tariffs', function () {
        return Inertia::render('settings/tariffs', [
            'tariffs' => [
                [
                    'id' => 1,
                    'category' => 'Hatch',
                    'daily' => 'R$ 120,00',
                    'km_extra' => 'R$ 0,50',
                    'late_fee' => 'R$ 50,00',
                    'deposit' => 'R$ 1.000,00',
                ],
                [
                    'id' => 2,
                    'category' => 'Sedan',
                    'daily' => 'R$ 150,00',
                    'km_extra' => 'R$ 0,65',
                    'late_fee' => 'R$ 60,00',
                    'deposit' => 'R$ 1.200,00',
                ],
                [
                    'id' => 3,
                    'category' => 'SUV',
                    'daily' => 'R$ 200,00',
                    'km_extra' => 'R$ 0,80',
                    'late_fee' => 'R$ 80,00',
                    'deposit' => 'R$ 1.500,00',
                ],
            ],
            'promotions' => [
                [
                    'id' => 1,
                    'title' => 'Promoção de Verão',
                    'active' => true,
                    'discount' => '15% OFF',
                    'period' => '01/12/2024 a 31/01/2025',
                    'categories' => 'Hatch, Sedan',
                ],
                [
                    'id' => 2,
                    'title' => 'Feriado Prolongado',
                    'active' => false,
                    'discount' => '10% OFF',
                    'period' => '15/11/2024 a 18/11/2024',
                    'categories' => 'Todas',
                ],
            ],
        ]);
    })->name('settings.tariffs');
});
