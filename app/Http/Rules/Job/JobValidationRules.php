<?php

namespace App\Http\Rules\Job;

use App\Contracts\ValidationRuleContract;

class JobValidationRules implements ValidationRuleContract
{
    /**
     * Get the validation rules used to create jobs.
     *
     * @return array
     */
    public function forCreate(): array
    {
        return [
            'name' => ['required', 'string', 'max:50'],
            'series_id' => ['required', 'numeric', 'exists:App\Models\Series,id'],
            'aci' => ['nullable'],
            'aci.fftw' => ['sometimes', 'numeric', 'required_with:aci.min_freq,aci.max_freq,aci.j', 'min:1', 'max:2147483647'],
            'aci.j' => ['sometimes', 'numeric', 'required_with:aci.min_freq,aci.max_freq,aci.fftw', 'min:1', 'max:2147483647'],
            'aci.max_freq' => ['sometimes', 'numeric', 'required_with:aci.min_freq,aci.j,aci.fftw', 'min:-1', 'max:2147483647'],
            'aci.min_freq' => ['sometimes', 'numeric', 'required_with:aci.max_freq,aci.j,aci.fftw', 'min:0', 'max:2147483647'],
            'adi' => ['nullable'],
            'adi.db_threshold' => ['sometimes', 'numeric', 'required_with:adi.max_freq,adi.freq_step', 'min:-2147483647', 'max:2147483647'],
            'adi.freq_step' => ['sometimes', 'numeric', 'required_with:adi.max_freq,adi.db_threshold', 'min:1', 'max:2147483647'],
            'adi.max_freq' => ['sometimes', 'numeric', 'required_with:adi.db_threshold,adi.freq_step', 'min:0', 'max:2147483647'],
            'aei' => ['nullable'],
            'aei.db_threshold' => ['sometimes', 'numeric', 'required_with:aei.max_freq,aei.freq_step', 'min:-2147483647', 'max:2147483647'],
            'aei.freq_step' => ['sometimes', 'numeric', 'required_with:aei.max_freq,aei.db_threshold', 'min:1', 'max:2147483647'],
            'aei.max_freq' => ['sometimes', 'numeric', 'required_with:aei.db_threshold,aei.freq_step', 'min:0', 'max:2147483647'],
            'bi' => ['nullable'],
            'bi.fftw' => ['sometimes', 'numeric', 'required_with:bi.min_freq,bi.max_freq', 'min:1', 'max:2147483647'],
            'bi.max_freq' => ['sometimes', 'numeric', 'required_with:bi.min_freq,bi.fftw', 'min:0', 'max:2147483647'],
            'bi.min_freq' => ['sometimes', 'numeric', 'required_with:bi.max_freq,bi.fftw', 'min:0', 'max:2147483647'],
            'ndsi' => ['nullable'],
            'ndsi.anthro_max' => ['sometimes', 'numeric', 'required_with:ndsi.fftw,ndsi.anthro_min,ndsi.bio_min,ndsi.bio_max', 'min:0', 'max:2147483647'],
            'ndsi.anthro_min' => ['sometimes', 'numeric', 'required_with:ndsi.fftw,ndsi.anthro_max,ndsi.bio_min,ndsi.bio_max', 'min:0', 'max:2147483647'],
            'ndsi.bio_max' => ['sometimes', 'numeric', 'required_with:ndsi.fftw,ndsi.anthro_min,ndsi.anthro_max,ndsi.bio_min', 'min:0', 'max:2147483647'],
            'ndsi.bio_min' => ['sometimes', 'numeric', 'required_with:ndsi.fftw,ndsi.anthro_min,ndsi.anthro_max,ndsi.bio_max', 'min:0', 'max:2147483647'],
            'ndsi.fftw' => ['sometimes', 'numeric', 'required_with:ndsi.anthro_min,ndsi.anthro_max,ndsi.bio_min,ndsi.bio_max', 'min:1', 'max:2147483647'],
            'rms' => ['sometimes', 'nullable', 'boolean'],
            'frequencyFilter' => ['nullable'],
            'frequencyFilter.min_freq' => ['sometimes', 'numeric', 'required_without:frequencyFilter.max_freq', 'min:0', 'max:2147483647'],
            'frequencyFilter.max_freq' => ['sometimes', 'numeric', 'required_without:frequencyFilter.min_freq','min:0', 'max:2147483647'],
            'acousticFilter' => ['nullable'],
            'acousticFilter.soundindex' => ['sometimes', 'string', 'required_with:acousticFilter.max_val','max:50'],
            'acousticFilter.max_val' => ['sometimes', 'numeric', 'required_with:acousticFilter.soundindex', 'min:-2147483647','max:2147483647'],
            'acousticFilter.timeStep' => ['sometimes', 'numeric','min:2', 'max:2147483647']
        ];
    }

    /**
     * Get the validation rules used to update promotions.
     *
     * @return array
     */
    public function forUpdate(): array
    {
        return [];
    }
}
