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
     * @param JobInput $job
     * @return bool
     */
    public function execute(JobInput $job): bool
    {
        $jobInput = $job->getInput();

        if($jobInput !== FALSE) {
            $process = proc_open(
                'Rscript processJob.R 2>&1',
                [1 => ["pipe", "w"]],
                $pipes,
                base_path('scripts/Rscripts'),
                ["input" => $jobInput]
            );

            if ($process !== FALSE && is_resource($process) && isset($pipes[1]) && is_resource($pipes[1])) {
                $output = stream_get_contents($pipes[1]);
            }
            proc_close($process);

            if (isset($output) && $output !== FALSE) {
                try {
                    $json_output = json_decode($output, true, 512, JSON_THROW_ON_ERROR);
                    if ($json_output !== NULL) {
                        $this->saveJobResults($job, $json_output);
                        return true;
                    }
                } catch (JsonException $e) {
                    Log::error("R Script output could not be decoded" . $this->rawRScriptLog($jobInput, $output));
                    return false;
                }
            }

            Log::error("No output from R Script" . $this->rawRScriptLog($jobInput, ""));
            return false;
        }
    }

    /**
     *
     * Save job results to database.
     *
     * @param JobInput $job
     * @param array $result
     * @return void
     */
    protected function saveJobResults(JobInput $job, array $results): void
    {
        try {
            if (isset($results['aci'])) {
                $job->aciInput->update([
                    'results' => json_encode($results['aci'], JSON_THROW_ON_ERROR)
                ]);
            }

            if (isset($results['adi'])) {
                $job->adiInput->update([
                    'results' => json_encode($results['adi'], JSON_THROW_ON_ERROR)
                ]);
            }

            if (isset($results['aei'])) {
                $job->aeiInput->update([
                    'results' => json_encode($results['aei'], JSON_THROW_ON_ERROR)
                ]);
            }

            if (isset($results['bi'])) {
                $job->biInput->update([
                    'results' => json_encode($results['bi'], JSON_THROW_ON_ERROR)
                ]);
            }

            if (isset($results['ndsi'])) {
                $job->ndsiInput->update([
                    'results' => json_encode($results['ndsi'], JSON_THROW_ON_ERROR)
                ]);
            }

            if (isset($results['rms'])) {
                $job->rmsInput->update([
                    'results' => json_encode($results['rms'], JSON_THROW_ON_ERROR)
                ]);
            }
        } catch (JsonException) {}
    }

    /**
     *
     * Create log string from R Script input and output.
     *
     * @param string $input
     * @param string $output
     * @return string
     */
    protected function rawRScriptLog(string $input, string $output): string
    {
        return "\n---RAW R SCRIPT INPUT---\n" . $input . "\n---RAW R SCRIPT INPUT---\n" . "\n---RAW R SCRIPT OUTPUT---\n" . $output . "\n---RAW R SCRIPT OUTPUT---\n";
    }
}
