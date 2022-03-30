<?php

namespace App\Contracts\Job;

use App\Models\JobInput;

interface UpdateJobContract
{
    /**
     * Update a JobInput.
     *
     * @param array $input
     * @param JobInput $promotion
     * @return bool
     */
    public function update(array $input, JobInput $promotion): bool;
}
