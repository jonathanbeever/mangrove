<?php

use App\Models\File;
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
        Schema::create('results', static function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Series::class)->constrained();
            $table->foreignIdFor(File::class)->constrained();
            $table->json('aci_results')->nullable();
            $table->json('adi_results')->nullable();
            $table->json('aei_results')->nullable();
            $table->json('bi_results')->nullable();
            $table->json('ndsi_results')->nullable();
            $table->json('rms_results')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('results');
    }
};
