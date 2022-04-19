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
        Schema::create('aci_inputs', static function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(JobInput::class)->constrained();
            $table->integer('fftw');
            $table->integer('j');
            $table->integer('max_freq');
            $table->integer('min_freq');

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
        Schema::dropIfExists('aci_inputs');
    }
};
