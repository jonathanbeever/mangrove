<?php

namespace App\Actions\Job;

use App\Contracts\Job\UpdateJobContract;
use App\Models\Job;
use Illuminate\Support\Facades\DB;
use Throwable;

class UpdateJob implements UpdateJobContract
{
    /**
     * Update a promotion.
     *
     * @param array $input
     * @param Job $job
     * @return bool
     */
    public function update(array $input, Job $job): bool
    {
        try {
            DB::transaction(function () use ($job, $input) {
                $job->update($input);
            });
        } catch (Throwable) {
            return false;
        }

        return true;
    }
}
