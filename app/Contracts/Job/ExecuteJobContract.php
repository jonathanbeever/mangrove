<?php

namespace App\Contracts\Job;

use App\Models\Job;

interface ExecuteJobContract
{
    /**
     * Execute a Job.
     *
     * @param Job $job
     * @return void
     */
    public function execute(Job $job): void;
}
