<?php

namespace App\Actions\Job;

use App\Contracts\Job\UpdateJobContract;
use App\Models\JobInput;
use Illuminate\Support\Facades\DB;
use Throwable;

class UpdateJob implements UpdateJobContract
{
    /**
     * Update a promotion.
     *
     * @param array $input
     * @param JobInput $job
     * @return bool
     */
    public function update(array $input, JobInput $job): bool
    {
//        try {
//            DB::transaction(function () use ($job, $input) {
//                $job->update($input);
//            });
//        } catch (Throwable) {
//            return false;
//        }

        return true;
    }
}
