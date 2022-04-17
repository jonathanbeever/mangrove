<?php

namespace App\Actions;

use App\Contracts\Import\ImportContract;
use App\Models\File;
use App\Models\Series;
use App\Models\Site;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Throwable;

class Import implements ImportContract
{

    /**
     * Import site, series, files, and metadata into database.
     *
     * @param array $input
     * @return bool
     */
    public function import(array $input): bool
    {
        try {
            return DB::transaction(function () use ($input) {
                $user = auth()->user();

                if ($user !== null) {
                    return false;
                }

                $site = $user->sites()->firstOrCreate([
                    'id' => $input['site_id'],
                ], [
                    'name' => $input['site'],
                    'location' => $input['location'],
                ]);

                $series = $site->series()->firstOrCreate([
                    'id' => $input['series_id'],
                ], [
                    'name' => $input['series'],
                ]);

                $this->importFiles($series, $input);

                return true;
            });
        } catch (Throwable) {
            return false;
        }
    }

    /**
     * Import files into database.
     *
     * @param  Series  $series
     * @param  array  $input
     * @return void
     */
    private function importFiles(Series $series, array $input): void
    {
        $fileModels = [];

        foreach ($input['files'] as $file) {
            $fileModels[] = $series->files()->firstOrNew([
                'name' => $file['name'],
                'size' => $file['size'],
            ], [
                'name' => $file['name'],
                'path' => $file['path'],
                'size' => $file['size'],
            ]);
        }

        if (isset($input['metadata'])) {
            $this->parseRecorderMetadata($series, $input['metadata']);
        }

        $series->files()->createMany($fileModels);
    }

    /**
     * @param  Series  $series
     * @param  array  $file
     * @return void
     */
    private function parseRecorderMetadata(Series $series, array $file): void
    {
        $realFilePath = rootfs_path($file['path']);
        $metadata = [];

        $metadataFile = file($realFilePath);

        if ($metadataFile !== FALSE) {
            // Read all CSV rows into array.
            $rows = array_map('str_getcsv', $metadataFile);
            // Remove header from CSV array.
            unset($rows[0]);

            // Create new model for each CSV row.
            foreach ($rows as $row) {
                $metadata[] = $series->fileMetadata()->firstOrNew([
                    'site' => $series->site()->id,
                    'series' => $series->id,
                    'recorded' => $row[0] . ' ' . $row[1],
                ], [
                    'site' => $series->site()->id,
                    'series' => $series->id,
                    'recorded' => $row[0] . ' ' . $row[1],
                    'latitude' => $row[2],
                    'latitude_direction' => $row[3],
                    'longitude' => $row[4],
                    'longitude_direction' => $row[5],
                    'battery_voltage' => $row[6],
                    'internal_temperature' => $row[7],
                    'files' => $row[8],
                    'mic0_type' => $row[9],
                    'mic1_type' => $row[10],
                ]);
            }

            // Save all CSV rows to database.
            $series->fileMetadata()->createMany($metadata);
        }
    }
}
