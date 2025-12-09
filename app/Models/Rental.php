<?php

namespace App\Models;

use App\Enums\FuelPolicy;
use App\Enums\RentalStatus;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rental extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'vehicle_id',
        'client_id',
        'user_id',
        'pickup_date',
        'planned_return_date',
        'return_date',
        'odometer_pickup',
        'odometer_return',
        'fuel_pickup',
        'fuel_return',
        'initial_status',
        'return_status',
        'photos_pickup',
        'photos_return',
        'checklist_pickup',
        'checklist_return',
        'damage_notes',
        'total_days',
        'allowed_km_per_day',
        'daily_rate',
        'extra_km',
        'extra_km_rate',
        'late_fee_rate',
        'late_fee_total',
        'cleaning_fee',
        'fuel_policy',
        'fuel_charge',
        'damage_cost',
        'extra_charges',
        'discounts',
        'subtotal',
        'total',
        'status',
        'notes',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'pickup_date' => 'datetime',
            'planned_return_date' => 'datetime',
            'return_date' => 'datetime',
            'daily_rate' => 'decimal:2',
            'extra_km_rate' => 'decimal:2',
            'late_fee_rate' => 'decimal:2',
            'late_fee_total' => 'decimal:2',
            'cleaning_fee' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'total' => 'decimal:2',
            'total_days' => 'integer',
            'allowed_km_per_day' => 'integer',
            'extra_km' => 'integer',
            'odometer_pickup' => 'integer',
            'odometer_return' => 'integer',
            'fuel_pickup' => 'decimal:2',
            'fuel_return' => 'decimal:2',
            'fuel_charge' => 'decimal:2',
            'damage_cost' => 'decimal:2',
            'extra_charges' => 'decimal:2',
            'discounts' => 'decimal:2',
            'photos_pickup' => 'array',
            'photos_return' => 'array',
            'checklist_pickup' => 'array',
            'checklist_return' => 'array',
            'fuel_policy' => FuelPolicy::class,
            'status' => RentalStatus::class,
        ];
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Calculates total days rounding every 24h block up.
     */
    public function calculateTotalDays(): int
    {
        $start = $this->pickup_date ? Carbon::parse($this->pickup_date) : null;
        $end = $this->return_date
            ? Carbon::parse($this->return_date)
            : ($this->planned_return_date ? Carbon::parse($this->planned_return_date) : null);

        if (!$start || !$end) {
            return max(1, (int) $this->total_days);
        }

        $minutes = max(0, $start->diffInMinutes($end));

        return max(1, (int) ceil($minutes / (60 * 24)));
    }

    /**
     * Calculates extra kilometers considering allowed_km_per_day.
     */
    public function calculateExtraKm(): int
    {
        if ($this->odometer_return === null || $this->odometer_pickup === null) {
            return 0;
        }

        $totalKm = $this->odometer_return - $this->odometer_pickup;
        $allowedKm = $this->calculateTotalDays() * $this->allowed_km_per_day;

        return max(0, $totalKm - $allowedKm);
    }

    /**
     * Calculates late fee using planned return date.
     */
    public function calculateLateFee(?Carbon $expectedReturnDate = null): float
    {
        $expectedReturnDate = $expectedReturnDate
            ? Carbon::parse($expectedReturnDate)
            : ($this->planned_return_date ? Carbon::parse($this->planned_return_date) : null);

        if (!$this->return_date || !$expectedReturnDate) {
            return 0.0;
        }

        $returnDate = Carbon::parse($this->return_date);
        if ($returnDate->lte($expectedReturnDate)) {
            return 0.0;
        }

        $minutesLate = $expectedReturnDate->diffInMinutes($returnDate);
        $daysLate = (int) ceil($minutesLate / (60 * 24));

        return $daysLate * (float) $this->late_fee_rate;
    }

    /**
     * Subtotal = daily total + extra km charges.
     */
    public function calculateSubtotal(): float
    {
        $days = $this->calculateTotalDays();
        $extraKm = $this->extra_km ?: $this->calculateExtraKm();

        $dailyTotal = $days * (float) $this->daily_rate;
        $extraKmTotal = $extraKm * (float) $this->extra_km_rate;

        return round($dailyTotal + $extraKmTotal, 2);
    }

    /**
     * Calculates fuel charge when tank needs refill.
     */
    public function calculateFuelCharge(float $tankCapacity, float $fuelPrice): float
    {
        if ($tankCapacity <= 0 || $fuelPrice <= 0) {
            return 0.0;
        }

        if ($this->fuel_pickup === null || $this->fuel_return === null) {
            return 0.0;
        }

        $missingFraction = max(0, (float) $this->fuel_pickup - (float) $this->fuel_return);
        if ($missingFraction <= 0) {
            return 0.0;
        }

        $litersMissing = $tankCapacity * $missingFraction;

        return round($litersMissing * $fuelPrice, 2);
    }

    /**
     * Calculates grand total including extras and discounts.
     */
    public function calculateTotal(): float
    {
        $subtotal = $this->calculateSubtotal();
        $lateFee = $this->late_fee_total ?: $this->calculateLateFee();

        $total = $subtotal
            + $lateFee
            + (float) $this->cleaning_fee
            + (float) $this->fuel_charge
            + (float) $this->damage_cost
            + (float) $this->extra_charges
            - (float) $this->discounts;

        return max(0, round($total, 2));
    }

    public function isActive(): bool
    {
        $status = $this->status instanceof RentalStatus ? $this->status->value : $this->status;

        return $status === RentalStatus::ACTIVE->value;
    }

    public function isCompleted(): bool
    {
        $status = $this->status instanceof RentalStatus ? $this->status->value : $this->status;

        return $status === RentalStatus::COMPLETED->value;
    }
}
