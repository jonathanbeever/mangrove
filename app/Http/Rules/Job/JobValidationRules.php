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
            'name' => ['required', 'string', 'max:15'],
            'aci' => ['nullable', 'array:min_freq,max_freq,j,fftw'],
            'aci.fftw' => ['sometimes', 'numeric', 'required_with:aci.min_freq,aci.max_freq,aci.j', 'min:1', 'max:2147483647'],
            'aci.j' => ['sometimes', 'numeric', 'required_with:aci.min_freq,aci.max_freq,aci.fftw', 'min:1', 'max:2147483647'],
            'aci.max_freq' => ['sometimes', 'numeric', 'required_with:aci.min_freq,aci.j,aci.fftw', 'min:-1', 'max:2147483647'],
            'aci.min_freq' => ['sometimes', 'numeric', 'required_with:aci.max_freq,aci.j,aci.fftw', 'min:0', 'max:2147483647'],
            'adi' => ['nullable', 'array:max_freq,db_threshold,freqStep'],
            'adi.db_threshold' => ['sometimes', 'numeric', 'required_with:adi.max_freq,adi.freqStep', 'min:-2147483647', 'max:2147483647'],
            'adi.freqStep' => ['sometimes', 'numeric', 'required_with:adi.max_freq,adi.db_threshold', 'min:1', 'max:2147483647'],
            'adi.max_freq' => ['sometimes', 'numeric', 'required_with:adi.db_threshold,adi.freqStep', 'min:0', 'max:2147483647'],
            'aei' => ['nullable', 'array:max_freq,db_threshold,freqStep'],
            'aei.db_threshold' => ['sometimes', 'numeric', 'required_with:aei.max_freq,aei.freqStep', 'min:-2147483647', 'max:2147483647'],
            'aei.freqStep' => ['sometimes', 'numeric', 'required_with:aei.max_freq,aei.db_threshold', 'min:1', 'max:2147483647'],
            'aei.max_freq' => ['sometimes', 'numeric', 'required_with:aei.db_threshold,aei.freqStep', 'min:0', 'max:2147483647'],
            'bi' => ['nullable', 'array:min_freq,max_freq,fftw'],
            'bi.fftw' => ['sometimes', 'numeric', 'required_with:bi.min_freq,bi.max_freq', 'min:1', 'max:2147483647'],
            'bi.max_freq' => ['sometimes', 'numeric', 'required_with:bi.min_freq,bi.fftw', 'min:0', 'max:2147483647'],
            'bi.min_freq' => ['sometimes', 'numeric', 'required_with:bi.max_freq,bi.fftw', 'min:0', 'max:2147483647'],
            'ndsi' => ['nullable', 'array:anthro_min,anthro_max,bio_min,bio_max'],
            'ndsi.anthro_max' => ['sometimes', 'numeric', 'required_with:ndsi.fftw,ndsi.anthro_min,ndsi.bio_min,ndsi.bio_max', 'min:0', 'max:2147483647'],
            'ndsi.anthro_min' => ['sometimes', 'numeric', 'required_with:ndsi.fftw,ndsi.anthro_max,ndsi.bio_min,ndsi.bio_max', 'min:0', 'max:2147483647'],
            'ndsi.bio_max' => ['sometimes', 'numeric', 'required_with:ndsi.fftw,ndsi.anthro_min,ndsi.anthro_max,ndsi.bio_min', 'min:0', 'max:2147483647'],
            'ndsi.bio_min' => ['sometimes', 'numeric', 'required_with:ndsi.fftw,ndsi.anthro_min,ndsi.anthro_max,ndsi.bio_max', 'min:0', 'max:2147483647'],
            'ndsi.fftw' => ['sometimes', 'numeric', 'required_with:ndsi.anthro_min,ndsi.anthro_max,ndsi.bio_min,ndsi.bio_max', 'min:1', 'max:2147483647'],
            'rms' => ['sometimes', 'nullable', 'boolean']
        ];
    }

    /**
     * Get the validation rules used to update promotions.
     *
     * @return array
     */
    public function forUpdate(): array
    {
        $ruleSet = $this->forCreate();

        foreach ($ruleSet as &$rules) {
            if (!in_array('sometimes', $rules, true)) {
                array_unshift($rules, 'sometimes');
            }
        }

        return $ruleSet;
    }
}
