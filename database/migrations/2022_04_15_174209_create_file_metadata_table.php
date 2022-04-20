<?php

use App\Models\Series;
use App\Models\Site;
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
        Schema::create('file_metadata', static function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Site::class)->constrained();
            $table->foreignIdFor(Series::class)->constrained();
            $table->dateTime('recorded');
            $table->decimal('latitude', 10, 8);
            $table->text('latitude_direction');
            $table->decimal('longitude', 11, 8);
            $table->text('longitude_direction');
            $table->float('battery_voltage');
            $table->float('internal_temperature');
            $table->unsignedTinyInteger('files');
            $table->text('mic0_type');
            $table->text('mic1_type');

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
        Schema::dropIfExists('file_metadata');
    }
};
