<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Os atributos que podem ser atribuídos em massa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'cpf',
        'cnh',
        'phone',
        'address',
        'email',
        'notes',
    ];

    /**
     * Relacionamento: Um cliente tem várias reservas.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Relacionamento: Um cliente tem várias locações.
     */
    public function rentals()
    {
        return $this->hasMany(Rental::class);
    }

    /**
     * Obtém o histórico de locações do cliente.
     */
    public function getRentalsHistory()
    {
        return $this->rentals()
            ->with('vehicle')
            ->orderBy('pickup_date', 'desc')
            ->get();
    }

    /**
     * Verifica se o cliente tem pendências.
     */
    public function hasPendingRentals(): bool
    {
        return $this->rentals()->where('status', 'active')->exists();
    }

    /**
     * Obtém o total de locações do cliente.
     */
    public function getTotalRentalsAttribute(): int
    {
        return $this->rentals()->count();
    }
}
