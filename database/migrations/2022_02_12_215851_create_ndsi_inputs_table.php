<?php

use App\Models\JobInput;
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
        Schema::create('ndsi_inputs', static function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(JobInput::class)->constrained();
            $table->integer('anthro_max');
            $table->integer('anthro_min');
            $table->integer('bio_max');
            $table->integer('bio_min');
            $table->integer('fftw');

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
        Schema::dropIfExists('ndsi_inputs');
    }
};
