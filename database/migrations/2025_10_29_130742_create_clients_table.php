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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nome completo
            $table->string('cpf', 14)->unique(); // CPF único (formato: 000.000.000-00)
            $table->string('cnh', 20)->nullable(); // Número da CNH
            $table->string('phone', 20)->nullable(); // Telefone
            $table->text('address')->nullable(); // Endereço completo
            $table->string('email')->nullable(); // E-mail
            $table->text('notes')->nullable(); // Observações e pendências
            $table->softDeletes(); // Soft delete
            $table->timestamps();
            
            // Índices
            $table->index('cpf');
            $table->index('email');
            $table->index('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
