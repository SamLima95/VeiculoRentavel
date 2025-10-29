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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // Usuário que realizou a ação
            $table->string('action'); // Ação: created, updated, deleted, cancelled, etc.
            $table->string('model_type'); // Tipo do modelo (Vehicle, Client, Reservation, etc.)
            $table->unsignedBigInteger('model_id')->nullable(); // ID do registro afetado
            $table->json('old_values')->nullable(); // Valores antigos (para updates)
            $table->json('new_values')->nullable(); // Valores novos
            $table->string('ip_address', 45)->nullable(); // IP do usuário
            $table->text('user_agent')->nullable(); // User agent do navegador
            $table->text('description')->nullable(); // Descrição detalhada da ação
            $table->timestamps(); // created_at e updated_at
            
            // Índices para consultas rápidas
            $table->index(['model_type', 'model_id']);
            $table->index('user_id');
            $table->index('action');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
