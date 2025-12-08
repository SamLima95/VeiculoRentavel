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
        Schema::table('vehicles', function (Blueprint $table) {
            $table->string('renavam')->nullable()->after('status');
            $table->date('licensing_date')->nullable()->after('renavam');
            $table->date('ipva_date')->nullable()->after('licensing_date');
            $table->string('insurance_name')->nullable()->after('insurance_data');
            $table->string('policy_number')->nullable()->after('insurance_name');
            $table->date('insurance_expiry')->nullable()->after('policy_number');
            $table->text('claim_notes')->nullable()->after('insurance_expiry');
            $table->string('photo_path')->nullable()->after('notes');
            $table->index('licensing_date');
            $table->index('ipva_date');
            $table->index('insurance_expiry');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn([
                'renavam',
                'licensing_date',
                'ipva_date',
                'insurance_name',
                'policy_number',
                'insurance_expiry',
                'claim_notes',
                'photo_path',
            ]);
        });
    }
};
