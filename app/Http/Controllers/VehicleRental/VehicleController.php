<?php

namespace App\Http\Controllers\VehicleRental;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleController extends Controller
{
    public function index()
    {
        return Inertia::render('VehicleRental/Vehicles');
    }
    
    public function create()
    {
        return Inertia::render('VehicleRental/Vehicles');
    }
    
    public function store(Request $request)
    {
        // Lógica para armazenar um novo veículo
        return response()->json(['success' => true]);
    }
    
    public function edit($id)
    {
        return Inertia::render('VehicleRental/Vehicles');
    }
    
    public function update(Request $request, $id)
    {
        // Lógica para atualizar um veículo
        return response()->json(['success' => true]);
    }
    
    public function destroy($id)
    {
        // Lógica para remover um veículo
        return response()->json(['success' => true]);
    }
}