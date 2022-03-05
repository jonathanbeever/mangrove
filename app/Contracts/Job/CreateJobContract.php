<?php

namespace App\Contracts\Job;

use App\Models\Job;

interface CreateJobContract
{
    /**
     * Create a Job.
     *
     * @param array $input
     * @return Job|null
     */
    public function create(array $input): ?Job;
}
