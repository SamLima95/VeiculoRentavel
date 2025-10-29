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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('model'); // Modelo do veículo (ex: Civic, Corolla)
            $table->string('brand'); // Marca (ex: Honda, Toyota)
            $table->integer('year'); // Ano de fabricação
            $table->string('color'); // Cor do veículo
            $table->string('plate')->unique(); // Placa única (RN001)
            $table->integer('mileage')->default(0); // Quilometragem atual
            $table->string('category'); // Categoria: Econômico, Intermediário, Executivo, SUV
            $table->enum('status', ['available', 'rented', 'maintenance'])->default('available'); // Status de disponibilidade
            $table->json('insurance_data')->nullable(); // Dados do seguro (nome, número, validade)
            $table->decimal('daily_rate', 10, 2); // Valor da diária
            $table->text('notes')->nullable(); // Observações gerais
            $table->softDeletes(); // Soft delete para inativação
            $table->timestamps();
            
            // Índices para melhor performance
            $table->index('status');
            $table->index('category');
            $table->index('plate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
