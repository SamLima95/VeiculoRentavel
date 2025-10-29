<?php

namespace App\Http\Controllers\VehicleRental;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use App\Models\Vehicle;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    /**
     * Exibe a lista de veículos.
     */
    public function index(Request $request): Response
    {
        $query = Vehicle::query();

        // Busca
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('model', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('plate', 'like', "%{$search}%");
            });
        }

        // Filtro por status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filtro por categoria
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Ordenação
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $vehicles = $query->paginate(15)->withQueryString();

        return Inertia::render('vehicles', [
            'vehicles' => $vehicles,
            'filters' => $request->only(['search', 'status', 'category', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Armazena um novo veículo.
     */
    public function store(StoreVehicleRequest $request): RedirectResponse
    {
        $vehicle = Vehicle::create($request->validated());

        // Log de auditoria
        AuditLogService::logCreated(
            $vehicle,
            "Veículo {$vehicle->brand} {$vehicle->model} (Placa: {$vehicle->plate}) criado"
        );

        return redirect()->route('vehicles.index')
            ->with('success', 'Veículo cadastrado com sucesso!');
    }

    /**
     * Exibe um veículo específico.
     */
    public function show(Vehicle $vehicle): Response
    {
        $vehicle->load([
            'reservations' => function ($query) {
                $query->latest()->limit(5);
            },
            'rentals' => function ($query) {
                $query->latest()->limit(5);
            },
            'maintenances' => function ($query) {
                $query->latest()->limit(5);
            },
        ]);

        return Inertia::render('VehicleRental/VehicleShow', [
            'vehicle' => $vehicle,
        ]);
    }

    /**
     * Atualiza um veículo existente.
     */
    public function update(UpdateVehicleRequest $request, Vehicle $vehicle): RedirectResponse
    {
        $oldValues = $vehicle->getAttributes();

        $vehicle->update($request->validated());

        // Log de auditoria
        AuditLogService::logUpdated(
            $vehicle,
            $oldValues,
            "Veículo {$vehicle->brand} {$vehicle->model} (Placa: {$vehicle->plate}) atualizado"
        );

        return redirect()->route('vehicles.index')
            ->with('success', 'Veículo atualizado com sucesso!');
    }

    /**
     * Remove (inativa) um veículo.
     */
    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        // Validar se o veículo pode ser inativado
        if ($vehicle->isRented()) {
            return redirect()->route('vehicles.index')
                ->with('error', 'Não é possível inativar um veículo que está locado.');
        }

        // Verificar se há reservas ativas
        $hasActiveReservations = $vehicle->reservations()
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        if ($hasActiveReservations) {
            return redirect()->route('vehicles.index')
                ->with('error', 'Não é possível inativar um veículo com reservas ativas.');
        }

        // Soft delete
        $vehicle->delete();

        // Log de auditoria
        AuditLogService::logDeleted(
            $vehicle,
            "Veículo {$vehicle->brand} {$vehicle->model} (Placa: {$vehicle->plate}) inativado"
        );

        return redirect()->route('vehicles.index')
            ->with('success', 'Veículo inativado com sucesso!');
    }

    /**
     * Verifica se uma placa está disponível (para validação em tempo real).
     */
    public function checkPlateAvailability(Request $request)
    {
        $request->validate([
            'plate' => ['required', 'string'],
            'vehicle_id' => ['nullable', 'integer', 'exists:vehicles,id'],
        ]);

        $plate = $request->input('plate');
        $vehicleId = $request->input('vehicle_id');

        $normalizedPlate = strtoupper(str_replace([' ', '-'], '', $plate));

        $query = Vehicle::where('plate', $normalizedPlate);

        if ($vehicleId) {
            $query->where('id', '!=', $vehicleId);
        }

        $exists = $query->exists();

        return response()->json([
            'available' => !$exists,
            'message' => $exists ? 'Esta placa já está cadastrada' : 'Placa disponível',
        ]);
    }
}
