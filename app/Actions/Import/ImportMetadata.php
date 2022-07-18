<?php

namespace App\Actions\Import;

use App\Contracts\Import\ImportMetadataContract;
use App\Models\Series;

class ImportMetadata implements ImportMetadataContract
{

    /**
     * @param  Series  $series
     * @param  array  $file
     * @return bool
     */
    public function import(Series $series, array $file): bool
    {
        $normalizedPath = normalize_path($file['path']);
        if ($normalizedPath === null) {
            return false;
        }

        $realFilePath = rootfs_path($normalizedPath);
        $metadataFile = file($realFilePath);

        if ($metadataFile !== false) {
            // Read all CSV rows into array.
            $rows = array_map('str_getcsv', $metadataFile);
            // Remove header from CSV array.
            unset($rows[0]);
            // Create new model for each CSV row.
            foreach ($rows as $row) {
                $recordedAt = strtotime($row[0].' '.$row[1]);

                if ($recordedAt !== false) {
                    $series->fileMetadata()->firstOrCreate([
                        'site_id' => $series->site->id,
                        'series_id' => $series->id,
                        'recorded' => $recordedAt,
                    ], [
                        'site_id' => $series->site->id,
                        'series_id' => $series->id,
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

            return true;
        }

        return false;
    }
}
