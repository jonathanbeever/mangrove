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
            'site' => ['required', 'string'],
            'series' => ['required', 'string'],
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
