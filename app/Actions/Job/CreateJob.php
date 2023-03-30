<?php

namespace App\Actions\Job;

use App\Contracts\Job\CreateJobContract;
use App\Models\JobInput;
use Illuminate\Support\Facades\DB;
use Throwable;

class CreateJob implements CreateJobContract
{

    /**
     * Create a new job and save it to authenticated user.
     *
     * @param  array  $input
     * @return JobInput|null
     */
    public function create(array $input): ?JobInput
    {
        try {
            return DB::transaction(function () use ($input) {
                return tap(new JobInput($input), function (JobInput $job) use ($input) {
                    $this->saveJobToUser($job);
                    $this->saveInputs($job, $input);
                });
            });
        } catch (Throwable) {
            return null;
        }
    }

    /**
     * Save the job to the user.
     *
     * @param  JobInput  $job
     * @return void
     */
    public function saveJobToUser(JobInput $job): void
    {
        auth()->user()?->jobs()->save($job);
    }

    /**
     * Save the related input models for this job.
     *
     * @param  JobInput  $job
     * @param  array  $input
     * @return void
     */
    public function saveInputs(JobInput $job, array $input): void
    {
        if (isset($input['aci'])) {
            $job->aciInput()->create($input['aci']);
        }

        if (isset($input['adi'])) {
            $job->adiInput()->create($input['adi']);
        }

        if (isset($input['aei'])) {
            $job->aeiInput()->create($input['aei']);
        }

        if (isset($input['bi'])) {
            $job->biInput()->create($input['bi']);
        }

        if (isset($input['ndsi'])) {
            $job->ndsiInput()->create($input['ndsi']);
        }

        if (isset($input['rms']) && $input['rms'] === true) {
            $job->rmsInput()->create();
        }

        if (isset($input['frequencyFilter'])) {
            $job->frequencyFilterInput()->create($input['frequencyFilter']);
        }

        if (isset($input['acousticFilter'])) {
            $job->acousticFilterInput()->create($input['acousticFilter']);
        }
    }
}
