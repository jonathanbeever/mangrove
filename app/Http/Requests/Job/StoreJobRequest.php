<?php

namespace App\Http\Requests\Job;

use App\Http\Rules\Job\JobValidationRules;
use App\Models\JobInput;
use Illuminate\Foundation\Http\FormRequest;

class StoreJobRequest extends FormRequest
{
    protected $errorBag = 'storeJobErrors';

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', JobInput::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @param  JobValidationRules  $rules
     * @return array
     */
    public function rules(JobValidationRules $rules): array
    {
        return $rules->forCreate();
    }
}
