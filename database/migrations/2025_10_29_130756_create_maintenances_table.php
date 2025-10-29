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
        Schema::create('maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // Usuário que registrou
            $table->enum('type', ['preventive', 'corrective']); // Tipo de manutenção
            $table->date('scheduled_date'); // Data agendada
            $table->date('completed_date')->nullable(); // Data de conclusão
            $table->decimal('cost', 10, 2)->default(0); // Custo da manutenção
            $table->string('provider')->nullable(); // Prestador de serviço/oficina
            $table->text('description')->nullable(); // Descrição da manutenção
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled'])->default('scheduled');
            $table->text('notes')->nullable(); // Observações
            $table->timestamps();
            
            // Índices
            $table->index('status');
            $table->index('scheduled_date');
            $table->index(['vehicle_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenances');
    }
};
