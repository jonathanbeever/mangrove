<?php

namespace App\Contracts\Job;

use App\Models\JobInput;

interface CreateJobContract
{
    /**
     * Create a JobInput.
     *
     * @param  array  $input
     * @return JobInput|null
     */
    public function create(array $input): ?JobInput;
}
