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
        Schema::create('rentals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->nullable()->constrained()->onDelete('set null'); // Reserva que gerou a locação (pode ser null se locação direta)
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Funcionário que realizou a locação
            $table->dateTime('pickup_date'); // Data/hora da retirada
            $table->dateTime('return_date')->nullable(); // Data/hora da devolução (null se ainda locado)
            $table->integer('pickup_odometer'); // Odômetro na retirada
            $table->integer('return_odometer')->nullable(); // Odômetro na devolução
            $table->text('initial_status')->nullable(); // Estado do veículo na retirada
            $table->text('return_status')->nullable(); // Estado do veículo na devolução
            $table->integer('total_days')->default(0); // Total de dias locados
            $table->integer('allowed_km_per_day')->default(100); // KM permitidos por dia
            $table->decimal('daily_rate', 10, 2); // Valor da diária
            $table->integer('extra_km')->default(0); // KM extras rodados
            $table->decimal('extra_km_rate', 10, 2)->default(0); // Taxa por KM extra
            $table->decimal('late_fee', 10, 2)->default(0); // Multa por atraso
            $table->decimal('fines', 10, 2)->default(0); // Multas adicionais (danos, etc)
            $table->decimal('subtotal', 10, 2)->default(0); // Subtotal (diárias + km extra)
            $table->decimal('total', 10, 2)->default(0); // Valor total (subtotal + multas)
            $table->enum('status', ['active', 'completed', 'cancelled'])->default('active');
            $table->text('notes')->nullable(); // Observações
            $table->timestamps();
            
            // Índices
            $table->index('status');
            $table->index('pickup_date');
            $table->index('return_date');
            $table->index(['vehicle_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rentals');
    }
};
