<?php

namespace App\Contracts\Job;

use App\Models\Job;

interface UpdateJobContract
{
    /**
     * Update a Job.
     *
     * @param array $input
     * @param Job $promotion
     * @return bool
     */
    public function update(array $input, Job $promotion): bool;
}
