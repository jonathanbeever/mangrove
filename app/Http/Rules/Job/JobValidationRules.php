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
            if (! in_array('sometimes', $rules)) {
                array_unshift($rules, 'sometimes');
            }
        }

        return $ruleSet;
    }
}
