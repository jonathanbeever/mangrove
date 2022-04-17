<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use JsonException;

class JobInput extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $with = ['aciInput', 'adiInput', 'aeiInput', 'biInput', 'ndsiInput', 'rmsInput'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'series_id',
    ];

    /**
     * Get the user that owns the job.
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the series that this job is using.
     *
     * @return BelongsTo
     */
    public function series(): BelongsTo
    {
        return $this->belongsTo(Series::class)->with('site');
    }

    /**
     * Get the ACI index input for this job.
     *
     * @return HasOne
     */
    public function aciInput(): HasOne
    {
        return $this->hasOne(AciInput::class);
    }

    /**
     * Get the ADI index input for this job.
     *
     * @return HasOne
     */
    public function adiInput(): HasOne
    {
        return $this->hasOne(AdiInput::class);
    }

    /**
     * Get the AEI index input for this job.
     *
     * @return HasOne
     */
    public function aeiInput(): HasOne
    {
        return $this->hasOne(AeiInput::class);
    }

    /**
     * Get the BI index input for this job.
     *
     * @return HasOne
     */
    public function biInput(): HasOne
    {
        return $this->hasOne(BiInput::class);
    }

    /**
     * Get the NDSI index input for this job.
     *
     * @return HasOne
     */
    public function ndsiInput(): HasOne
    {
        return $this->hasOne(NdsiInput::class);
    }

    /**
     * Get the RMS index input for this job.
     *
     * @return HasOne
     */
    public function rmsInput(): HasOne
    {
        return $this->hasOne(RmsInput::class);
    }

    /**
     * Get the input object to send to the R script.
     *
     * @return string|false
     */
    public function getInput(): string|false
    {
        $path = $this->series()->path();

        if($path !== NULL) {
            $jobInput = [
                'meta' => [
                    'path' => $path,
                    'cores' => 1,
                ],
                'inputs' => [],
            ];

            if ($this->aciInput !== null) {
                $aciInput = $this->aciInput->toArray();
                if (!empty($aciInput)) {
                    $jobInput['inputs']['aci'] = $aciInput;
                    $jobInput['inputs']['aci']['name'] = 'acoustic_complexity';
                    $jobInput['inputs']['aci']['type'] = 'aci';
                }
            }

            if ($this->adiInput !== null) {
                $adiInput = $this->adiInput->toArray();
                if (!empty($adiInput)) {
                    $jobInput['inputs']['adi'] = $adiInput;
                    $jobInput['inputs']['adi']['name'] = 'acoustic_diversity';
                    $jobInput['inputs']['adi']['type'] = 'adi';
                    $jobInput['inputs']['adi']['shannon'] = true;
                }
            }

            if ($this->aeiInput !== null) {
                $aeiInput = $this->aeiInput->toArray();
                if (!empty($aeiInput)) {
                    $jobInput['inputs']['aei'] = $aeiInput;
                    $jobInput['inputs']['aei']['name'] = 'acoustic_evenness';
                    $jobInput['inputs']['aei']['type'] = 'aei';
                }
            }

            if ($this->biInput !== null) {
                $biInput = $this->biInput->toArray();
                if (!empty($biInput)) {
                    $jobInput['inputs']['bi'] = $biInput;
                    $jobInput['inputs']['bi']['name'] = 'bioacoustic_index';
                    $jobInput['inputs']['bi']['type'] = 'bi';
                }
            }

            if ($this->ndsiInput !== null) {
                $ndsiInput = $this->ndsiInput->toArray();
                if (!empty($ndsiInput)) {
                    $jobInput['inputs']['ndsi'] = $ndsiInput;
                    $jobInput['inputs']['ndsi']['name'] = 'ndsi';
                    $jobInput['inputs']['ndsi']['type'] = 'ndsi';
                }
            }

            if ($this->rmsInput !== null) {
                $jobInput['inputs']['rms']['name'] = 'root_mean_square';
                $jobInput['inputs']['rms']['type'] = 'rms';
            }

            try {
                return json_encode($jobInput, JSON_THROW_ON_ERROR);
            } catch (JsonException $e) {
                Log::error($e->getMessage()."JobInput input could not be encoded to JSON.");
                return false;
            }
        }

        return false;
    }
}
