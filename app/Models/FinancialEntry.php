<?php

namespace App\Models;

use App\Enums\FinancialEntryNature;
use App\Enums\FinancialEntryStatus;
use App\Enums\FinancialEntryType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinancialEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'source_type',
        'source_id',
        'vehicle_id',
        'client_id',
        'nature',
        'type',
        'amount',
        'currency',
        'exchange_rate',
        'amount_converted',
        'description',
        'entry_date',
        'due_date',
        'paid_at',
        'status',
        'is_estimated',
        'is_overdue',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'nature' => FinancialEntryNature::class,
            'type' => FinancialEntryType::class,
            'status' => FinancialEntryStatus::class,
            'amount' => 'decimal:2',
            'amount_converted' => 'decimal:2',
            'exchange_rate' => 'decimal:6',
            'entry_date' => 'date',
            'due_date' => 'date',
            'paid_at' => 'datetime',
            'is_estimated' => 'boolean',
            'is_overdue' => 'boolean',
        ];
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function isAutomatic(): bool
    {
        return $this->source_type !== 'manual';
    }
}
