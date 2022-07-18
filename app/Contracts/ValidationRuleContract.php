<?php

namespace App\Contracts;

interface ValidationRuleContract
{
    /**
     * Returns validation rules for resource creation.
     *
     * @return array
     */
    public function forCreate(): array;

    /**
     * Returns validation rules for updating resource.
     *
     * @return array
     */
    public function forUpdate(): array;
}
