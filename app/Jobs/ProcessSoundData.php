<?php

namespace App\Jobs;

use App\Contracts\Job\ExecuteJobContract;
use App\Models\JobInput;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;

class ProcessSoundData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 0;

    private User $user;
    private JobInput $jobInput;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(JobInput $job, User $user)
    {
        $this->jobInput = $job;
        $this->user = $user;
    }

    /**
     * Execute the job.
     *
     * @param  ExecuteJobContract  $contract
     * @return void
     */
    public function handle(ExecuteJobContract $contract): void
    {
        Auth::login($this->user);
        $contract->execute($this->jobInput);
    }
}
