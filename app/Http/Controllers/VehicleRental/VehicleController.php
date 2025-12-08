<?php

namespace App\Http\Controllers\VehicleRental;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use App\Http\Resources\VehicleResource;
use App\Models\Vehicle;
use App\Repositories\VehicleRepository;
use App\Services\VehicleService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function __construct(
        private readonly VehicleRepository $vehicles,
        private readonly VehicleService $service
    ) {
    }

    /**
     * Exibe a lista de veículos.
     */
    public function index(Request $request): Response
    {
        $vehicles = $this->vehicles->filterVehicles($request->all())
            ->through(fn ($vehicle) => VehicleResource::make($vehicle)->resolve());

        return Inertia::render('vehicles/index', [
            'vehicles' => $vehicles,
            'filters' => $request->only(['search', 'status', 'category', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Exibe o formulário de criação.
     */
    public function create(): Response
    {
        return Inertia::render('vehicles/create');
    }

    /**
     * Armazena um novo veículo.
     */
    public function store(StoreVehicleRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());

        return redirect()->route('vehicles.index')
            ->with('success', 'Veículo cadastrado com sucesso!');
    }

    /**
     * Exibe um veículo específico.
     */
    public function show(Vehicle $vehicle): Response
    {
        $vehicleResource = VehicleResource::make(
            $this->vehicles->findWithRelations($vehicle->id)
        );

        return Inertia::render('vehicles/show', [
            'vehicle' => $vehicleResource,
        ]);
    }

    /**
     * Exibe o formulário de edição.
     */
    public function edit(Vehicle $vehicle): Response
    {
        return Inertia::render('vehicles/create', [
            'vehicle' => VehicleResource::make($vehicle),
        ]);
    }

    /**
     * Atualiza um veículo existente.
     */
    public function update(UpdateVehicleRequest $request, Vehicle $vehicle): RedirectResponse
    {
        $this->service->update($vehicle, $request->validated());

        return redirect()->route('vehicles.index')
            ->with('success', 'Veículo atualizado com sucesso!');
    }

    /**
     * Remove (inativa) um veículo.
     */
    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        try {
            $this->service->inactivate($vehicle);
        } catch (DomainException $e) {
            return redirect()->route('vehicles.index')
                ->with('error', $e->getMessage());
        }

        return redirect()->route('vehicles.index')
            ->with('success', 'Veículo inativado com sucesso!');
    }

    /**
     * Rota auxiliar para inativar via POST (usada pelo front).
     */
    public function inactivate(Vehicle $vehicle): RedirectResponse
    {
        return $this->destroy($vehicle);
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

        $plate = (string) $request->input('plate');
        $vehicleId = $request->input('vehicle_id');

        $available = $this->service->checkPlateAvailability($plate, $vehicleId);

        return response()->json([
            'available' => $available,
            'message' => $available ? 'Placa disponível' : 'Esta placa já está cadastrada',
        ]);
    }
}
