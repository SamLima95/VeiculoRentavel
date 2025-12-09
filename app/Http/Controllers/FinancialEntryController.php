<?php

namespace App\Http\Controllers;

use App\Http\Requests\PayFinancialEntryRequest;
use App\Http\Requests\StoreFinancialEntryRequest;
use App\Http\Requests\UpdateFinancialEntryRequest;
use App\Http\Resources\FinancialEntryResource;
use App\Models\FinancialEntry;
use App\Repositories\FinancialRepository;
use App\Services\FinancialService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FinancialEntryController extends Controller
{
    public function __construct(
        private readonly FinancialRepository $repository,
        private readonly FinancialService $service
    ) {
    }

    public function index(Request $request): Response
    {
        $filters = $request->only([
            'source_type',
            'source_id',
            'status',
            'type',
            'vehicle_id',
            'client_id',
            'start_date',
            'end_date',
            'due_start',
            'due_end',
        ]);

        $entries = $this->repository->filter($filters)
            ->through(fn ($item) => FinancialEntryResource::make($item)->resolve());

        return Inertia::render('finance/entries', [
            'entries' => $entries,
            'filters' => $filters,
            'summary' => $this->repository->summary($filters),
        ]);
    }

    public function store(StoreFinancialEntryRequest $request): RedirectResponse
    {
        try {
            $this->service->create($request->validated());
        } catch (DomainException $e) {
            return redirect()->route('finance.entries.index')->with('error', $e->getMessage());
        }

        return redirect()->route('finance.entries.index')
            ->with('success', 'Lancamento criado com sucesso.');
    }

    public function show(FinancialEntry $entry)
    {
        $entry = $this->repository->findWithRelations($entry->id);

        return FinancialEntryResource::make($entry);
    }

    public function update(UpdateFinancialEntryRequest $request, FinancialEntry $entry): RedirectResponse
    {
        try {
            $this->service->update($entry, $request->validated());
        } catch (DomainException $e) {
            return redirect()->route('finance.entries.index')->with('error', $e->getMessage());
        }

        return redirect()->route('finance.entries.index')
            ->with('success', 'Lancamento atualizado com sucesso.');
    }

    public function pay(PayFinancialEntryRequest $request, FinancialEntry $entry): RedirectResponse
    {
        try {
            $this->service->pay($entry, $request->validated());
        } catch (DomainException $e) {
            return redirect()->route('finance.entries.index')->with('error', $e->getMessage());
        }

        return redirect()->route('finance.entries.index')
            ->with('success', 'Pagamento registrado.');
    }

    public function cancel(Request $request, FinancialEntry $entry): RedirectResponse
    {
        $createReversal = (bool) $request->input('create_reversal', false);

        $this->service->cancel($entry, $createReversal);

        return redirect()->route('finance.entries.index')
            ->with('success', 'Lancamento cancelado.');
    }
}
