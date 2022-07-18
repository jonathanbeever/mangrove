<?php

namespace App\Contracts\Import;

interface ImportContract
{
    /**
     * Import files from a series and site.
     *
     * @param  array  $input
     * @return bool
     */
    public function import(array $input): bool;
}
