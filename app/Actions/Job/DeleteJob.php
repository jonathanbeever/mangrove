<?php

namespace App\Actions\Job;

use App\Contracts\Job\DeleteJobContract;
use App\Models\Job;
use Illuminate\Support\Facades\DB;
use Throwable;

class DeleteJob implements DeleteJobContract
{

    /**
     * Delete a promotion and cascade delete references.
     *
     * @param Job $job
     * @return bool
     */
    public function delete(Job $job): bool
    {
        try {
            DB::transaction(function () use ($job) {
                $job->delete();
            });
        } catch (Throwable) {
            return false;
        }

        return true;
    }
}
