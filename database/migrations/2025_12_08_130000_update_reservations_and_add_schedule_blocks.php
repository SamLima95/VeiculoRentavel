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
        // Campos adicionais na tabela de reservas
        Schema::table('reservations', function (Blueprint $table) {
            $table->decimal('estimated_value', 10, 2)->nullable()->after('status');
            $table->string('source')->default('internal')->after('estimated_value');
            $table->unsignedBigInteger('created_by')->nullable()->after('source');
            $table->unsignedBigInteger('updated_by')->nullable()->after('created_by');

            $table->index('source');

            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
        });

        // Tabela de bloqueios de agenda dos veículos
        Schema::create('vehicle_schedule_blocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->string('source_type'); // reservation|rental|maintenance
            $table->unsignedBigInteger('source_id');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->timestamps();

            $table->index(['vehicle_id', 'start_date', 'end_date']);
            $table->index(['source_type', 'source_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_schedule_blocks');

        Schema::table('reservations', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
            $table->dropIndex(['source']);

            $table->dropColumn([
                'estimated_value',
                'source',
                'created_by',
                'updated_by',
            ]);
        });
    }
};
