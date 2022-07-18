<?php

namespace App\Contracts\Job;

use App\Models\JobInput;

interface DeleteJobContract
{
    /**
     * Delete a JobInput.
     *
     * @param  JobInput  $job
     * @return bool
     */
    public function delete(JobInput $job): bool;
}
