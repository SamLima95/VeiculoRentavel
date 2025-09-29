<?php

namespace App\Http\Controllers\VehicleRental;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        return Inertia::render('VehicleRental/Clients');
    }
    
    public function create()
    {
        return Inertia::render('VehicleRental/Clients');
    }
    
    public function store(Request $request)
    {
        // Lógica para armazenar um novo cliente
        return response()->json(['success' => true]);
    }
    
    public function edit($id)
    {
        return Inertia::render('VehicleRental/Clients');
    }
    
    public function update(Request $request, $id)
    {
        // Lógica para atualizar um cliente
        return response()->json(['success' => true]);
    }
    
    public function destroy($id)
    {
        // Lógica para remover um cliente
        return response()->json(['success' => true]);
    }
}