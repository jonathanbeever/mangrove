<?php

namespace App\Actions\Job;

use App\Contracts\Job\ExecuteJobContract;
use App\Models\Job;

class ExecuteJob implements ExecuteJobContract
{
    /**
     * Execute a job and store job output to database.
     *
     * @param Job $job
     * @return void
     */
    public function execute(Job $job): void
    {
        $process = proc_open('Rscript processJob.R 2>&1', [1 => ["pipe", "w"]], $pipes, base_path('scripts/Rscripts'), ["input" => $job->getInput()]);
        if ($process !== FALSE && is_resource($process) ) {
            if (isset($pipes[0]) && is_resource($pipes[0])) {
                $output = stream_get_contents($pipes[0]);
            }
        }
        proc_close($process);

        if (isset($output) && $output !== FALSE) {
            $json_output = json_decode($output, true);
            if ($json_output !== NULL) {
                $this->saveJob($json_output);
            }
        }
    }

    /**
     *
     * Save job results to database.
     *
     * @param array $result
     * @return void
     */
    protected function saveJob(array $result): void
    {
        dd($result);
    }
}
