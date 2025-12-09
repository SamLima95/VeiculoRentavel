<?php

namespace App\Http\Controllers;

use App\Http\Requests\RentalCheckoutRequest;
use App\Http\Requests\RentalDamageReportRequest;
use App\Http\Requests\RentalFromReservationRequest;
use App\Http\Requests\StoreRentalRequest;
use App\Http\Resources\RentalResource;
use App\Models\Rental;
use App\Models\Reservation;
use App\Repositories\RentalRepository;
use App\Services\RentalService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RentalController extends Controller
{
    public function __construct(
        private readonly RentalRepository $rentals,
        private readonly RentalService $service
    ) {
    }

    public function index(Request $request): Response
    {
        $rentals = $this->rentals->filter($request->all())
            ->through(fn ($item) => RentalResource::make($item)->resolve());

        return Inertia::render('rentals/index', [
            'rentals' => $rentals,
            'filters' => $request->only(['status', 'vehicle_id', 'client_id', 'start_date', 'end_date']),
            'counters' => $this->rentals->countersByStatus(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('rentals/create');
    }

    public function store(StoreRentalRequest $request): RedirectResponse
    {
        try {
            $rental = $this->service->create($request->validated());
        } catch (DomainException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }

        return redirect()->route('rentals.show', $rental->id)
            ->with('success', 'Locacao criada com sucesso!');
    }

    public function show(Rental $rental): Response
    {
        $rental = $this->rentals->findWithRelations($rental->id);

        return Inertia::render('rentals/show', [
            'rental' => RentalResource::make($rental),
        ]);
    }

    public function checkOut(RentalCheckoutRequest $request, Rental $rental): RedirectResponse
    {
        try {
            $this->service->checkOut($rental, $request->validated());
        } catch (DomainException $e) {
            return redirect()->route('rentals.show', $rental->id)
                ->with('error', $e->getMessage());
        }

        return redirect()->route('rentals.show', $rental->id)
            ->with('success', 'Check-out registrado com sucesso!');
    }

    public function cancel(Rental $rental): RedirectResponse
    {
        try {
            $this->service->cancel($rental);
        } catch (DomainException $e) {
            return redirect()->route('rentals.show', $rental->id)
                ->with('error', $e->getMessage());
        }

        return redirect()->route('rentals.show', $rental->id)
            ->with('success', 'Locacao cancelada.');
    }

    public function damageReport(RentalDamageReportRequest $request, Rental $rental): RedirectResponse
    {
        try {
            $this->service->reportDamage($rental, $request->validated());
        } catch (DomainException $e) {
            return redirect()->route('rentals.show', $rental->id)
                ->with('error', $e->getMessage());
        }

        return redirect()->route('rentals.show', $rental->id)
            ->with('success', 'Dano registrado.');
    }

    public function fromReservation(RentalFromReservationRequest $request): RedirectResponse
    {
        $reservation = Reservation::findOrFail($request->validated('reservation_id'));

        try {
            $rental = $this->service->fromReservation($reservation, $request->validated());
        } catch (DomainException $e) {
            return redirect()->route('reservations.show', $reservation->id)
                ->with('error', $e->getMessage());
        }

        return redirect()->route('rentals.show', $rental->id)
            ->with('success', 'Reserva convertida em locacao.');
    }
}
