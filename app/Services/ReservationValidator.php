<?php

namespace App\Services;

use App\Repositories\ReservationRepository;
use Carbon\Carbon;
use DomainException;

class ReservationValidator
{
    public function __construct(private readonly ReservationRepository $reservations)
    {
    }

    public function validatePeriod(Carbon $start, Carbon $end): void
    {
        if ($start->greaterThanOrEqualTo($end)) {
            throw new DomainException('Data inicial deve ser menor que a data final.');
        }

        if ($start->isPast()) {
            throw new DomainException('A reserva deve iniciar no futuro.');
        }
    }

    public function validateAvailability(int $vehicleId, Carbon $start, Carbon $end, ?int $ignoreReservationId = null): void
    {
        if ($this->reservations->overlapsSchedule($vehicleId, $start, $end, $ignoreReservationId)) {
            throw new DomainException('Periodo indisponivel para o veiculo selecionado.');
        }
    }
}
