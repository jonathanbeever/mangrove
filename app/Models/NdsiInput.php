<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NdsiInput extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'anthro_min',
        'anthro_max',
        'bio_min',
        'bio_max',
        'fftw',
        'results',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'results' => 'object',
    ];

    /**
     * Get the job input that owns the input.
     */
    public function jobInput(): BelongsTo
    {
        return $this->belongsTo(JobInput::class);
    }
}
