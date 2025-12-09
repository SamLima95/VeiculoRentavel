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
        Schema::table('rentals', function (Blueprint $table) {
            // Datas de planejamento e retirada/devolucao
            $table->dateTime('planned_return_date')->after('pickup_date');

            // Medicoes e combustivel
            $table->renameColumn('pickup_odometer', 'odometer_pickup');
            $table->renameColumn('return_odometer', 'odometer_return');
            $table->decimal('fuel_pickup', 5, 2)->nullable()->after('odometer_pickup');
            $table->decimal('fuel_return', 5, 2)->nullable()->after('fuel_pickup');

            // Politicas/financeiro
            $table->decimal('late_fee_rate', 10, 2)->default(0)->after('extra_km_rate');
            $table->renameColumn('late_fee', 'late_fee_total');
            $table->decimal('cleaning_fee', 10, 2)->default(0)->after('late_fee_rate');
            $table->string('fuel_policy')->default('full_to_full')->after('cleaning_fee');
            $table->renameColumn('fines', 'extra_charges');
            $table->decimal('damage_cost', 10, 2)->default(0)->after('extra_charges');
            $table->decimal('discounts', 10, 2)->default(0)->after('damage_cost');
            $table->decimal('fuel_charge', 10, 2)->default(0)->after('discounts');

            // Midia/checklist
            $table->json('photos_pickup')->nullable()->after('return_status');
            $table->json('photos_return')->nullable()->after('photos_pickup');
            $table->json('checklist_pickup')->nullable()->after('photos_return');
            $table->json('checklist_return')->nullable()->after('checklist_pickup');
            $table->text('damage_notes')->nullable()->after('checklist_return');

            // Auditoria
            $table->unsignedBigInteger('created_by')->nullable()->after('notes');
            $table->unsignedBigInteger('updated_by')->nullable()->after('created_by');

            $table->index('planned_return_date');

            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rentals', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);

            $table->dropIndex(['planned_return_date']);

            $table->dropColumn([
                'planned_return_date',
                'fuel_pickup',
                'fuel_return',
                'late_fee_rate',
                'cleaning_fee',
                'fuel_policy',
                'damage_cost',
                'discounts',
                'fuel_charge',
                'photos_pickup',
                'photos_return',
                'checklist_pickup',
                'checklist_return',
                'damage_notes',
                'created_by',
                'updated_by',
            ]);

            $table->renameColumn('odometer_pickup', 'pickup_odometer');
            $table->renameColumn('odometer_return', 'return_odometer');
            $table->renameColumn('late_fee_total', 'late_fee');
            $table->renameColumn('extra_charges', 'fines');
        });
    }
};
