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
        Schema::create('financial_entries', function (Blueprint $table) {
            $table->id();
            $table->string('source_type'); // rental|reservation|maintenance|manual
            $table->unsignedBigInteger('source_id')->nullable();
            $table->foreignId('vehicle_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('client_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('nature', ['credit', 'debit']);
            $table->string('type', 60);
            $table->decimal('amount', 12, 2);
            $table->char('currency', 3)->default('BRL');
            $table->decimal('exchange_rate', 12, 6)->nullable();
            $table->decimal('amount_converted', 12, 2)->nullable();
            $table->text('description')->nullable();
            $table->date('entry_date');
            $table->date('due_date')->nullable();
            $table->dateTime('paid_at')->nullable();
            $table->enum('status', ['provisioned', 'open', 'paid', 'cancelled'])->default('provisioned');
            $table->boolean('is_estimated')->default(true);
            $table->boolean('is_overdue')->default(false);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            $table->unique(['source_type', 'source_id', 'type'], 'financial_entries_source_unique');
            $table->index('status');
            $table->index('type');
            $table->index('entry_date');
            $table->index('due_date');
            $table->index('vehicle_id');
            $table->index('client_id');
            $table->index('is_overdue');

            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financial_entries');
    }
};
