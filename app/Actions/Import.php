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

    private Site $site;
    private Series $series;
    private User $user;

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
                $this->user = auth()->user();

                if ($this->user === null) {
                    return false;
                }

                if (isset($input['site_id'])) {
                    $this->site = $this->user->sites()->find($input['site_id']);
                } else if (isset($input['site'])) {
                    $this->site = $this->user->sites()->firstOrCreate([
                        'name' => $input['site'],
                        'location' => $input['location'],
                    ], [
                        'name' => $input['site'],
                        'location' => $input['location'],
                    ]);
                } else {
                    return false;
                }

                $this->series = $this->site->series()->create([
                    'user_id' => $this->user->id,
                    'name' => $input['series'],
                ]);

                $this->importFiles($input);

                return true;
            });
        } catch (Throwable) {
            return false;
        }
    }

    /**
     * Import files into database.
     *
     * @param  array  $input
     * @return void
     */
    private function importFiles(array $input): void
    {
        foreach ($input['files'] as $file) {
            $this->series->files()->firstOrCreate([
                'user_id' => $this->user->id,
                'name' => $file['name'],
                'size' => $file['size'],
            ], [
                'user_id' => $this->user->id,
                'site_id' => $this->site->id,
                'name' => $file['name'],
                'path' => normalize_path($file['path']),
                'size' => $file['size'],
            ]);
        }

        if (isset($input['metadata'])) {
            $this->parseRecorderMetadata($input['metadata']);
        }
    }

    /**
     * @param  array  $file
     * @return void
     */
    private function parseRecorderMetadata(array $file): void
    {
        $realFilePath = rootfs_path(normalize_path($file['path']));
        $metadataFile = file($realFilePath);

        if ($metadataFile !== FALSE) {
            // Read all CSV rows into array.
            $rows = array_map('str_getcsv', $metadataFile);
            // Remove header from CSV array.
            unset($rows[0]);
            // Create new model for each CSV row.
            foreach ($rows as $row) {
                $recordedAt = strtotime($row[0] . ' ' . $row[1]);

                if ($recordedAt !== false) {
                    $this->series->fileMetadata()->firstOrCreate([
                        'site_id' => $this->series->site->id,
                        'series_id' => $this->series->id,
                        'recorded' => $recordedAt,
                    ], [
                        'site_id' => $this->series->site->id,
                        'series_id' => $this->series->id,
                        'recorded' => $recordedAt,
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
            }
        }
    }
}
