<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Http\Requests\RentalFromReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use App\Repositories\ReservationRepository;
use App\Services\ReservationService;
use App\Services\RentalService;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use DomainException;

class ReservationController extends Controller
{
    public function __construct(
        private readonly ReservationRepository $reservations,
        private readonly ReservationService $service,
        private readonly RentalService $rentalService
    ) {
    }

    public function index(Request $request): Response
    {
        $reservations = $this->reservations->filter($request->all())
            ->through(fn ($item) => ReservationResource::make($item)->resolve());

        return Inertia::render('reservations', [
            'reservations' => $reservations,
            'filters' => $request->only(['status', 'vehicle_id', 'client_id', 'start_date', 'end_date']),
            'counters' => $this->reservations->countersByStatus(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('reservations/create', [
            'vehicles' => Vehicle::where('status', 'available')
                ->orWhere('status', 'maintenance') // Include maintenance for visibility but maybe disabled
                ->get()
                ->map(fn ($v) => [
                    'id' => $v->id,
                    'title' => $v->model . ' ' . $v->brand,
                    'plate' => $v->plate,
                    'category' => $v->category, // Assuming category exists or use logic
                    'mileage' => $v->mileage . ' km',
                    'price' => 'R$ ' . number_format($v->daily_rate, 2, ',', '.'),
                    'image' => $v->image, // Ensure this exists or handle null in frontend
                    'status' => $v->status,
                ]),
            'clients' => \App\Models\Client::all()->map(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'cpf' => $c->cpf,
                'phone' => $c->phone,
                'status' => 'ok', // Placeholder logic
            ]),
        ]);
    }

    public function store(StoreReservationRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());

        return redirect()->route('reservations.index')
            ->with('success', 'Reserva criada com sucesso!');
    }

    public function show(Reservation $reservation): Response
    {
        $reservation = $this->reservations->findWithRelations($reservation->id);

        return Inertia::render('reservations/show', [
            'reservation' => ReservationResource::make($reservation),
        ]);
    }

    public function edit(Reservation $reservation): Response
    {
        return Inertia::render('reservations/create', [
            'reservation' => ReservationResource::make($reservation),
        ]);
    }

    public function update(UpdateReservationRequest $request, Reservation $reservation): RedirectResponse
    {
        $this->service->update($reservation, $request->validated());

        return redirect()->route('reservations.index')
            ->with('success', 'Reserva atualizada com sucesso!');
    }

    public function destroy(Reservation $reservation): RedirectResponse
    {
        // Cancelar rota mais explicita
        $this->service->cancel($reservation);

        return redirect()->route('reservations.index')
            ->with('success', 'Reserva cancelada com sucesso!');
    }

    public function confirm(Reservation $reservation): RedirectResponse
    {
        $this->service->confirm($reservation);

        return redirect()->route('reservations.show', $reservation->id)
            ->with('success', 'Reserva confirmada!');
    }

    public function cancel(Reservation $reservation): RedirectResponse
    {
        $this->service->cancel($reservation);

        return redirect()->route('reservations.show', $reservation->id)
            ->with('success', 'Reserva cancelada!');
    }

    public function checkAvailability(Request $request)
    {
        $data = $request->validate([
            'vehicle_id' => ['required', 'integer', 'exists:vehicles,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date'],
            'reservation_id' => ['nullable', 'integer', 'exists:reservations,id'],
        ]);

        $start = Carbon::parse($data['start_date']);
        $end = Carbon::parse($data['end_date']);

        $available = !$this->reservations->overlapsSchedule(
            $data['vehicle_id'],
            $start,
            $end,
            $data['reservation_id'] ?? null
        );

        $conflicts = $this->reservations->conflicts(
            $data['vehicle_id'],
            $start,
            $end,
            $data['reservation_id'] ?? null
        );

        $vehicle = Vehicle::find($data['vehicle_id']);
        $priceEstimate = null;
        if ($vehicle?->daily_rate) {
            $days = max(1, $start->diffInDays($end));
            $priceEstimate = round($vehicle->daily_rate * $days, 2);
        }

        return response()->json([
            'available' => $available,
            'conflicts' => $conflicts->map(function ($c) {
                return [
                    'source_type' => $c->source_type,
                    'source_id' => $c->source_id,
                    'start_date' => $c->start_date,
                    'end_date' => $c->end_date,
                ];
            }),
            'suggested_periods' => [], // TODO: sugerir janelas disponiveis se houver conflito
            'price_estimate' => $priceEstimate,
            'vehicle_status' => $conflicts->first()?->vehicle?->status ?? null,
        ]);
    }

    public function convertToRental(RentalFromReservationRequest $request, Reservation $reservation): RedirectResponse
    {
        try {
            $rental = $this->rentalService->fromReservation($reservation, $request->validated());
        } catch (DomainException $e) {
            return redirect()->route('reservations.show', $reservation->id)
                ->with('error', $e->getMessage());
        }

        return redirect()->route('rentals.show', $rental->id)
            ->with('success', 'Reserva convertida em locacao.');
    }
}
