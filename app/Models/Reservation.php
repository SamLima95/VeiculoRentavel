<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\ReservationStatus;
use App\Enums\ReservationSource;

class Reservation extends Model
{
    use HasFactory;

    /**
     * Os atributos que podem ser atribuídos em massa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'vehicle_id',
        'client_id',
        'user_id',
        'start_date',
        'end_date',
        'status',
        'estimated_value',
        'source',
        'created_by',
        'updated_by',
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
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'status' => ReservationStatus::class,
            'source' => ReservationSource::class,
            'estimated_value' => 'decimal:2',
        ];
    }

    /**
     * Relacionamento: Uma reserva pertence a um veículo.
     */
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    /**
     * Relacionamento: Uma reserva pertence a um cliente.
     */
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Relacionamento: Uma reserva pertence a um usuário (quem criou).
     */
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
     * Relacionamento: Uma reserva pode ter uma locação.
     */
    public function rental()
    {
        return $this->hasOne(Rental::class);
    }

    /**
     * Verifica se a reserva está ativa.
     */
    public function isActive(): bool
    {
        return in_array($this->status, ['pending', 'confirmed']);
    }

    /**
     * Verifica se a reserva foi cancelada.
     */
    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    /**
     * Verifica se a reserva foi concluída.
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Calcula a quantidade de dias da reserva.
     */
    public function getDaysAttribute(): int
    {
        if (!$this->start_date || !$this->end_date) {
            return 0;
        }

        return $this->start_date->diffInDays($this->end_date);
    }
}
