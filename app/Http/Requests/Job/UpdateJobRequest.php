<?php

namespace App\Http\Requests\Job;

use App\Http\Rules\Job\JobValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class UpdateJobRequest extends FormRequest
{
    protected $errorBag = 'updateJobErrors';

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->job);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @param JobValidationRules $rules
     * @return array
     */
    public function rules(JobValidationRules $rules): array
    {
        return $rules->forUpdate();
    }
}
