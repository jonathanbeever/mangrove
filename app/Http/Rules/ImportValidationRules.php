<?php

namespace App\Http\Rules;

use App\Contracts\ValidationRuleContract;

class ImportValidationRules implements ValidationRuleContract
{
    /**
     * Get the validation rules used to create jobs.
     *
     * @return array
     */
    public function forCreate(): array
    {
        return [
            'site' => ['required_without:site_id', 'string', 'max:50'],
            'site_id' => ['required_without:site', 'numeric', 'exists:App\Models\Site,id'],
            'series' => ['required_without:series_id', 'string', 'max:50'],
            'series_id' => ['required_without:series', 'numeric', 'exists:App\Models\Series,id'],
            'location' => ['sometimes', 'nullable', 'string'],
            'files' => ['required', 'array'],
            'files.*' => ['required', 'array:name,size,path'],
            'files.*.name' => ['required', 'string'],
            'files.*.path' => ['required', 'string'],
            'files.*.size' => ['required', 'numeric'],
            'metadata' => ['sometimes', 'nullable', 'array'],
            'metadata.name' => ['sometimes', 'string'],
            'metadata.path' => ['sometimes', 'string'],
            'metadata.size' => ['sometimes', 'numeric'],
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
