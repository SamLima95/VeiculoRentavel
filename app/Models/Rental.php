<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Rental extends Model
{
    use HasFactory;

    /**
     * Os atributos que podem ser atribuídos em massa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'reservation_id',
        'vehicle_id',
        'client_id',
        'user_id',
        'pickup_date',
        'return_date',
        'pickup_odometer',
        'return_odometer',
        'initial_status',
        'return_status',
        'total_days',
        'allowed_km_per_day',
        'daily_rate',
        'extra_km',
        'extra_km_rate',
        'late_fee',
        'fines',
        'subtotal',
        'total',
        'status',
        'notes',
    ];

    /**
     * Os atributos que devem ser convertidos.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'pickup_date' => 'datetime',
            'return_date' => 'datetime',
            'daily_rate' => 'decimal:2',
            'extra_km_rate' => 'decimal:2',
            'late_fee' => 'decimal:2',
            'fines' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'total' => 'decimal:2',
            'total_days' => 'integer',
            'allowed_km_per_day' => 'integer',
            'extra_km' => 'integer',
            'pickup_odometer' => 'integer',
            'return_odometer' => 'integer',
        ];
    }

    /**
     * Relacionamento: Uma locação pertence a uma reserva.
     */
    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    /**
     * Relacionamento: Uma locação pertence a um veículo.
     */
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Relacionamento: Uma locação pertence a um cliente.
     */
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Relacionamento: Uma locação pertence a um usuário.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Calcula a quilometragem extra baseada nos KM permitidos por dia.
     */
    public function calculateExtraKm(): int
    {
        if (!$this->return_odometer || !$this->pickup_odometer) {
            return 0;
        }

        $totalKm = $this->return_odometer - $this->pickup_odometer;
        $allowedKm = $this->total_days * $this->allowed_km_per_day;
        $extraKm = max(0, $totalKm - $allowedKm);

        return $extraKm;
    }

    /**
     * Calcula a multa por atraso baseada na data de devolução esperada.
     */
    public function calculateLateFee(?Carbon $expectedReturnDate = null): float
    {
        if (!$this->return_date || !$expectedReturnDate) {
            return 0;
        }

        if ($this->return_date->gt($expectedReturnDate)) {
            // Atraso em dias
            $daysLate = $this->return_date->diffInDays($expectedReturnDate);
            // Multa por dia de atraso (pode ser configurável)
            $lateFeePerDay = $this->daily_rate * 0.5; // 50% da diária por dia de atraso
            return $daysLate * $lateFeePerDay;
        }

        return 0;
    }

    /**
     * Calcula o subtotal (diárias + km extra).
     */
    public function calculateSubtotal(): float
    {
        $dailyTotal = $this->total_days * $this->daily_rate;
        $extraKmTotal = $this->extra_km * $this->extra_km_rate;
        
        return $dailyTotal + $extraKmTotal;
    }

    /**
     * Calcula o valor total (subtotal + multas + taxas).
     */
    public function calculateTotal(): float
    {
        $subtotal = $this->calculateSubtotal();
        return max(0, $subtotal + $this->late_fee + $this->fines);
    }

    /**
     * Verifica se a locação está ativa.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Verifica se a locação foi finalizada.
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }
}
