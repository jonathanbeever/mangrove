<?php

namespace App\Contracts\Job;

use App\Models\Job;

interface DeleteJobContract
{
    /**
     * Delete a Job.
     *
     * @param Job $job
     * @return bool
     */
    public function delete(Job $job): bool;
}
