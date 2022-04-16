<?php

if (! function_exists('rootfs_path')) {
    /**
     * Get the path to the base of the root filesystem.
     *
     * @param  string  $path
     * @return string
     */
    function rootfs_path(string $path = ''): string
    {
        return app()->basePath('rootfs' . $path);
    }
}
