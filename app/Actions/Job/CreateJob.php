<?php

namespace App\Actions\Job;

use App\Contracts\Job\CreateJobContract;
use App\Models\Job;
use Illuminate\Support\Facades\DB;
use Throwable;

class CreateJob implements CreateJobContract
{

    /**
     * Create a new job and save it to authenticated user.
     *
     * @param array $input
     * @return Job|null
     */
    public function create(array $input): ?Job
    {
        try {
            return DB::transaction(function () use ($input) {
                return tap(new Job($input), function (Job $job) use ($input) {
                    $this->saveJobToUser($job);
                });
            });
        } catch (Throwable) {
            return null;
        }
    }

    /**
     * Save the job to the user.
     *
     * @param Job $job
     * @return void
     */
    public function saveJobToUser(Job $job): void
    {
        auth()->user()->jobs()->save($job);
    }
}
