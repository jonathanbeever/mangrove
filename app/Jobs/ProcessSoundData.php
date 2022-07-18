<?php

namespace App\Jobs;

use App\Contracts\Job\ExecuteJobContract;
use App\Enums\Job\JobStatusEnum;
use App\Models\JobInput;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;
use Throwable;

class ProcessSoundData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 0;

    private JobInput $jobInput;
    private User $user;

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

        $this->jobInput->update(['status' => JobStatusEnum::RUNNING]);
        $job = $contract->execute($this->jobInput);
        $this->jobInput->update(['status' => $job ? JobStatusEnum::SUCCEEDED : JobStatusEnum::FAILED]);
    }

    /**
     * Handle a job failure.
     *
     * @param  Throwable  $exception
     * @return void
     */
    public function failed(Throwable $exception): void
    {
        $this->jobInput->update(['status' => JobStatusEnum::FAILED]);
    }
}
