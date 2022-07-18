<?php

namespace App\Contracts\Job;

use App\Models\JobInput;

interface ExecuteJobContract
{
    /**
     * Execute a JobInput.
     *
     * @param  JobInput  $job
     * @return bool
     */
    public function execute(JobInput $job): bool;
}
