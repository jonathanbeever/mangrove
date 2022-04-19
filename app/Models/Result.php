<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Result extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $with = ['file'];

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'series_id',
        'aci_results',
        'adi_results',
        'aei_results',
        'bi_results',
        'ndsi_results',
        'rms_results',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'aci_results' => 'object',
        'adi_results' => 'object',
        'aei_results' => 'object',
        'bi_results' => 'object',
        'ndsi_results' => 'object',
        'rms_results' => 'object',
    ];


    /**
     * Get the file the results are for.
     *
     * @return BelongsTo
     */
    public function file(): BelongsTo
    {
        return $this->belongsTo(File::class);
    }
}
