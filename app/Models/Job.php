<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Job extends Model
{
    use HasFactory;
    use SoftDeletes;

    const default_params = [
        "aci" => [
            "type" => 'aci',
            "minFreq" => 0,
            "maxFreq" => -1,
            "j" => 5,
            "fftW" => 512,
        ],
        "adi" => [
            "type" => 'adi',
            "maxFreq" => 10000,
            "dbThreshold" => -50,
            "freqStep" => 1000,
            "shannon" => true,
        ],
        "aei" => [
            "type" => 'aei',
            "maxFreq" => 10000,
            "dbThreshold" => -50,
            "freqStep" => 1000,
        ],
        "bi" => [
            "type" => 'bi',
            "minFreq" => 2000,
            "maxFreq" => 8000,
            "fftW" => 512,
        ],
        "ndsi" => [
            "type" => 'ndsi',
            "fftW" => 1024,
            "anthroMin" => 1000,
            "anthroMax" => 2000,
            "bioMin" => 2000,
            "bioMax" => 11000,
        ],
        "rms" => [
            "type" => 'rms',
        ]
    ];

    /**
     * Get the user that owns the job.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getInput(): ?string
    {
        return json_encode([
            'input' => [
                'path' => 'wav/test.wav',
                'site' => 'UCF Arboretum',
                'series' => 'Hurricane Irma',
                'name' => 'Test Input',
                'recordTimeMs' => 1505016000000,
                'durationMs' => 30000,
                'sampleRateHz' => 44100,
                'sizeBytes' => 5292044,
                'coords' => [
                    'lat' => 28.596238,
                    'long' => -81.191381
                ],
                'downloadUrl' => 'file:wav/test.wav'
            ],
            'spec' => Job::default_params['ndsi'],
        ]);
    }

}
