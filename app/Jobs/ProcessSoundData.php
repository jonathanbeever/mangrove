<?php

namespace App\Jobs;

use App\Contracts\Job\ExecuteJobContract;
use App\Models\JobInput;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessSoundData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 0;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @param JobInput $job
     * @param ExecuteJobContract $contract
     * @return void
     */
    public function handle(JobInput $job, ExecuteJobContract $contract): void
    {
        $contract->execute($job);
    }
}
