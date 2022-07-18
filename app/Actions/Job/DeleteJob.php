<?php

namespace App\Actions\Job;

use App\Contracts\Job\DeleteJobContract;
use App\Models\JobInput;
use Illuminate\Support\Facades\DB;
use Throwable;

class DeleteJob implements DeleteJobContract
{

    /**
     * Delete a promotion and cascade delete references.
     *
     * @param  JobInput  $job
     * @return bool
     */
    public function delete(JobInput $job): bool
    {
        try {
            DB::transaction(static function () use ($job) {
                $job->delete();
            });
        } catch (Throwable) {
            return false;
        }

        return true;
    }
}
