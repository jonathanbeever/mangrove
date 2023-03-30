<?php

namespace App\Actions\Job;

use App\Contracts\Job\ExecuteJobContract;
use App\Models\JobInput;
use Illuminate\Support\Facades\Log;
use JsonException;

class ExecuteJob implements ExecuteJobContract
{
    /**
     * Execute a job and store job output to database.
     *
     * @param  JobInput  $job
     * @return bool
     */
    public function execute(JobInput $job): bool
    {
        $jobInput = $job->getInput();

        $process = proc_open(
            "Rscript processJob.R 2>&1",
            // "Rscript --max-ppsize=80000000 processJob.R 2>&1",
            [1 => ["pipe", "w"]],
            $pipes,
            base_path('scripts/Rscripts'),
            ["input" => $jobInput]
        );

        if ($process !== false && is_resource($process) && isset($pipes[1]) && is_resource($pipes[1])) {
            $output = stream_get_contents($pipes[1]);
        }
        proc_close($process);

        if (isset($output) && $output !== false) {
            try {
                $json_output = json_decode($output, true, 512, JSON_THROW_ON_ERROR);
                if ($json_output !== null) {
                    return $this->saveJobResults($job, $json_output);
                }
            } catch (JsonException $e) {
                Log::error("R Script output could not be decoded".$this->rawRScriptLog($jobInput, $output));
                return false;
            }
        }

        Log::error("No output from R Script".$this->rawRScriptLog($jobInput, ""));
        return false;
    }

    /**
     *
     * Save job results to database.
     *
     * @param  JobInput  $job
     * @param  array  $results
     * @return bool
     */
    protected function saveJobResults(JobInput $job, array $results): bool
    {
        try {
            foreach (['aci', 'adi', 'aei', 'bi', 'ndsi', 'rms', 'frequencyFilter', 'acousticFilter'] as $index) {
                if (isset($results[$index])) {
                    foreach ($results[$index] as $fileName => $data) {
                        $job->series->fileByName($fileName)?->results()->updateOrCreate([
                            'series_id' => $job->series->id
                        ], [
                            'series_id' => $job->series->id,
                            $index.'_results' => json_encode($data, JSON_THROW_ON_ERROR)
                        ]);
                    }
                }
            }

            return true;
        } catch (JsonException) {
            return false;
        }
    }

    /**
     *
     * Create log string from R Script input and output.
     *
     * @param  string  $input
     * @param  string  $output
     * @return string
     */
    protected function rawRScriptLog(string $input, string $output): string
    {
        return "\n---RAW R SCRIPT INPUT---\n".$input."\n---RAW R SCRIPT INPUT---\n"."\n---RAW R SCRIPT OUTPUT---\n".$output."\n---RAW R SCRIPT OUTPUT---\n";
    }
}
