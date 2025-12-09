<?php

use App\Http\Controllers\FinanceController;
use App\Http\Controllers\FinancialEntryController;
use App\Http\Controllers\RentalController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\VehicleRental\ClientController;
use App\Http\Controllers\VehicleRental\VehicleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Veiculos
    Route::resource('vehicles', VehicleController::class);
    Route::post('vehicles/{vehicle}/inactivate', [VehicleController::class, 'inactivate'])->name('vehicles.inactivate');
    Route::get('vehicles/check-plate', [VehicleController::class, 'checkPlateAvailability'])->name('vehicles.check-plate');

    // Clientes (placeholders)
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

    // Manutencao (placeholders)
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

    // Reservas
    Route::get('reservations', [ReservationController::class, 'index'])->name('reservations');
    Route::get('reservations/create', [ReservationController::class, 'create'])->name('reservations.create');
    Route::post('reservations', [ReservationController::class, 'store'])->name('reservations.store');
    Route::get('reservations/{reservation}', [ReservationController::class, 'show'])->name('reservations.show');
    Route::get('reservations/{reservation}/edit', [ReservationController::class, 'edit'])->name('reservations.edit');
    Route::put('reservations/{reservation}', [ReservationController::class, 'update'])->name('reservations.update');
    Route::delete('reservations/{reservation}', [ReservationController::class, 'destroy'])->name('reservations.destroy');
    Route::post('reservations/{reservation}/confirm', [ReservationController::class, 'confirm'])->name('reservations.confirm');
    Route::post('reservations/{reservation}/cancel', [ReservationController::class, 'cancel'])->name('reservations.cancel');
    Route::post('reservations/{reservation}/convert-to-rental', [ReservationController::class, 'convertToRental'])->name('reservations.convert-to-rental');
    Route::get('reservations/check-availability', [ReservationController::class, 'checkAvailability'])->name('reservations.check-availability');

    // Locacoes
    Route::get('rentals', [RentalController::class, 'index'])->name('rentals');
    Route::get('rentals/create', [RentalController::class, 'create'])->name('rentals.create');
    Route::post('rentals', [RentalController::class, 'store'])->name('rentals.store');
    Route::get('rentals/{rental}', [RentalController::class, 'show'])->name('rentals.show');
    Route::post('rentals/{rental}/check-out', [RentalController::class, 'checkOut'])->name('rentals.check-out');
    Route::post('rentals/{rental}/cancel', [RentalController::class, 'cancel'])->name('rentals.cancel');
    Route::post('rentals/{rental}/damage-report', [RentalController::class, 'damageReport'])->name('rentals.damage-report');
    Route::post('rentals/from-reservation', [RentalController::class, 'fromReservation'])->name('rentals.from-reservation');

    Route::prefix('finance')->name('finance.')->group(function () {
        Route::get('/', [FinanceController::class, 'index'])->name('index');

        Route::get('/entries', [FinancialEntryController::class, 'index'])->name('entries.index');
        Route::post('/entries', [FinancialEntryController::class, 'store'])->name('entries.store');
        Route::get('/entries/{entry}', [FinancialEntryController::class, 'show'])->name('entries.show');
        Route::put('/entries/{entry}', [FinancialEntryController::class, 'update'])->name('entries.update');
        Route::post('/entries/{entry}/pay', [FinancialEntryController::class, 'pay'])->name('entries.pay');
        Route::post('/entries/{entry}/cancel', [FinancialEntryController::class, 'cancel'])->name('entries.cancel');
    });

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
                    'title' => 'Promocao de Verao',
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
