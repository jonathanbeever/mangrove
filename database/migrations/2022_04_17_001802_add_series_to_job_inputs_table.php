<?php

use App\Models\Series;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('job_inputs', static function (Blueprint $table) {
            $table->foreignIdFor(Series::class)->after('user_id')->constrained();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('job_inputs', static function (Blueprint $table) {
            $table->dropForeign('series_id');
            $table->dropColumn(['series_id']);
        });
    }
};
