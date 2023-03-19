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
    public function up()
    {
        Schema::create('acoustic_filter_inputs', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(JobInput::class)->constrained();
            $table->string('soundindex');
            $table->integer('max_val');
            $table->integer('timeStep');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('acoustic_filter_inputs');
    }
};
