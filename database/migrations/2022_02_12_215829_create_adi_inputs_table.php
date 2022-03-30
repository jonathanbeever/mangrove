<?php

use App\Models\JobInput;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('adi_inputs', static function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignIdFor(JobInput::class)->constrained();
            $table->integer('db_threshold');
            $table->integer('freq_step');
            $table->integer('max_freq');
            $table->json('results')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('adi_inputs');
    }
};
