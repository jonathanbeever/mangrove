<?php

namespace App\Http\Requests;

use App\Http\Rules\ImportValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class ImportRequest extends FormRequest
{
    protected $errorBag = 'importErrors';

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @param  ImportValidationRules  $rules
     * @return array
     */
    public function rules(ImportValidationRules $rules): array
    {
        return $rules->forCreate();
    }
}
