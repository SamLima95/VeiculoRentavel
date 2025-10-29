<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade'); // Veículo reservado
            $table->foreignId('client_id')->constrained()->onDelete('cascade'); // Cliente que reservou
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Funcionário que criou a reserva
            $table->dateTime('start_date'); // Data/hora de início da reserva
            $table->dateTime('end_date'); // Data/hora de fim da reserva
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->text('notes')->nullable(); // Observações
            $table->timestamps();
            
            // Índices para verificação de disponibilidade
            $table->index(['vehicle_id', 'start_date', 'end_date']);
            $table->index('status');
            $table->index('start_date');
            $table->index('end_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
