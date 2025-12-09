<?php

namespace App\Http\Controllers;

use App\Repositories\FinancialRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FinanceController extends Controller
{
    public function __construct(private readonly FinancialRepository $repository)
    {
    }

    public function index(Request $request): Response
    {
        $filters = $request->only(['start_date', 'end_date', 'source_type', 'status', 'type']);

        return Inertia::render('finance', [
            'summary' => $this->repository->summary($filters),
            'aging' => $this->repository->agingBuckets(),
            'filters' => $filters,
        ]);
    }
}
