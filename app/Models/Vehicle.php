<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Os atributos que podem ser atribuídos em massa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'model',
        'brand',
        'year',
        'color',
        'plate',
        'mileage',
        'category',
        'status',
        'insurance_data',
        'daily_rate',
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
            'insurance_data' => 'array',
            'daily_rate' => 'decimal:2',
            'year' => 'integer',
            'mileage' => 'integer',
        ];
    }

    /**
     * Relacionamento: Um veículo tem várias reservas.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Relacionamento: Um veículo tem várias locações.
     */
    public function rentals()
    {
        return $this->hasMany(Rental::class);
    }

    /**
     * Relacionamento: Um veículo tem várias manutenções.
     */
    public function maintenances()
    {
        return $this->hasMany(Maintenance::class);
    }

    /**
     * Scope: Apenas veículos disponíveis.
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    /**
     * Scope: Veículos em manutenção.
     */
    public function scopeInMaintenance($query)
    {
        return $query->where('status', 'maintenance');
    }

    /**
     * Scope: Veículos locados.
     */
    public function scopeRented($query)
    {
        return $query->where('status', 'rented');
    }

    /**
     * Verifica se o veículo está disponível para locação.
     */
    public function isAvailable(): bool
    {
        return $this->status === 'available';
    }

    /**
     * Verifica se o veículo está em manutenção.
     */
    public function isInMaintenance(): bool
    {
        return $this->status === 'maintenance';
    }

    /**
     * Verifica se o veículo está locado.
     */
    public function isRented(): bool
    {
        return $this->status === 'rented';
    }

    /**
     * Retorna o nome completo do veículo (marca + modelo).
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->brand} {$this->model}";
    }
}
