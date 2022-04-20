<?php

namespace App\Contracts\Import;

use App\Models\Series;

interface ImportMetadataContract
{
    /**
     * Import metadata from a recorder metadata file.
     *
     * @param  Series  $series
     * @param  array  $file
     * @return bool
     */
    public function import(Series $series, array $file): bool;
}
