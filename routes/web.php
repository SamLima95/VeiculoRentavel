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
    Route::get('vehicles', function () {
        return Inertia::render('vehicles');
    })->name('vehicles');
    
    Route::get('clients', function () {
        return Inertia::render('clients');
    })->name('clients');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
