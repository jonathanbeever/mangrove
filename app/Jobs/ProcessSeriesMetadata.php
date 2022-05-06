<?php

namespace App\Jobs;

use App\Contracts\Import\ImportMetadataContract;
use App\Models\Series;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;

class ProcessSeriesMetadata implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 0;

    private array $metadataFile;
    private Series $series;
    private User $user;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(array $metadataFile, Series $series, User $user)
    {
        $this->metadataFile = $metadataFile;
        $this->series = $series;
        $this->user = $user;
    }

    /**
     * Execute the job.
     *
     * @param  ImportMetadataContract  $contract
     * @return void
     */
    public function handle(ImportMetadataContract $contract): void
    {
        Auth::login($this->user);
        $contract->import($this->series, $this->metadataFile);
    }
}
