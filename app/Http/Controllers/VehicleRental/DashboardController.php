<?php

namespace App\Http\Controllers\VehicleRental;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('VehicleRental/Dashboard');
    }
}