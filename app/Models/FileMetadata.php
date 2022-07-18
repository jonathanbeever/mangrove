<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FileMetadata extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'site_id',
        'series_id',
        'recorded',
        'latitude',
        'latitude_direction',
        'longitude',
        'longitude_direction',
        'battery_voltage',
        'internal_temperature',
        'files',
        'mic0_type',
        'mic1_type',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'recorded' => 'datetime',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'battery_voltage' => 'float',
        'internal_temperature' => 'float',
        'files' => 'integer',
    ];

    /**
     * Get the site the metadata is for.
     *
     * @return BelongsTo
     */
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    /**
     * Get the series the metadata is for.
     *
     * @return BelongsTo
     */
    public function series(): BelongsTo
    {
        return $this->belongsTo(Series::class);
    }
}
