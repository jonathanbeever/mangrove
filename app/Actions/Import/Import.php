<?php

namespace App\Actions\Import;

use App\Contracts\Import\ImportContract;
use App\Jobs\ProcessSeriesMetadata;
use App\Models\Series;
use App\Models\Site;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Throwable;

class Import implements ImportContract
{

    private Site|null $site;
    private Series|null $series;
    private User|null $user;

    /**
     * Import site, series, files, and metadata into database.
     *
     * @param  array  $input
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
                } else {
                    if (isset($input['site'])) {
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
                }

                if (isset($input['files'][0]['path'])) {
                    $normalizedPath = normalize_path($input['files'][0]['path']);
                    if ($normalizedPath === null) {
                        return false;
                    }

                    $seriesPath = pathinfo($normalizedPath, PATHINFO_DIRNAME);
                } else {
                    return false;
                }

                $this->series = $this->site->series()->create([
                    'user_id' => $this->user->id,
                    'path' => $seriesPath,
                    'name' => $input['series'],
                ]);

                return $this->importFiles($input);
            });
        } catch (Throwable) {
            return false;
        }
    }

    /**
     * Import files into database.
     *
     * @param  array  $input
     * @return bool
     */
    private function importFiles(array $input): bool
    {
        foreach ($input['files'] as $file) {
            $normalizedPath = normalize_path($file['path']);
            if ($normalizedPath === null) {
                return false;
            }

            $this->series->files()->firstOrCreate([
                'user_id' => $this->user->id,
                'name' => $file['name'],
                'size' => $file['size'],
            ], [
                'user_id' => $this->user->id,
                'site_id' => $this->site->id,
                'name' => $file['name'],
                'path' => rootfs_path($normalizedPath),
                'size' => $file['size'],
            ]);
        }

        if (isset($input['metadata'])) {
            ProcessSeriesMetadata::dispatch($input['metadata'], $this->series, auth()->user());
        }

        return true;
    }
}
