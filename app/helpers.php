<?php

if (!function_exists('rootfs_path')) {
    /**
     * Get the path to the base of the root filesystem.
     *
     * @param  string  $path
     * @return string
     */
    function rootfs_path(string $path = ''): string
    {
        return app()->basePath('rootfs'.$path);
    }
}

if (!function_exists('normalize_path')) {
    /**
     * Convert windows paths to unix paths.
     *
     * Inspired from:
     * https://developer.wordpress.org/reference/functions/wp_normalize_path/
     *
     * @param $path
     * @return string
     */
    function normalize_path($path): ?string
    {
        $wrapper = '';
        $scheme_separator = strpos($path, '://');
        $stream = substr($path, 0, $scheme_separator);
        $is_stream = in_array($stream, stream_get_wrappers(), true);

        if ($is_stream) {
            [$wrapper, $path] = explode('://', $path, 2);
            $wrapper .= '://';
        }

        // Standardise all paths to use '/'.
        $path = str_replace('\\', '/', $path);

        // Replace multiple slashes down to a singular, allowing for network shares having two slashes.
        $path = preg_replace('|(?<=.)/+|', '/', $path);

        // Windows paths should lowercase the drive letter because
        // they will be accessed through WSL mnt folder.
        if (':' === $path[1]) {
            $path = lcfirst($path);

            // Some WSL installations had the mount path set to /mnt_host during testing.
            if (is_dir('/mnt/' . $path[0])) {
                $mount_path = '/mnt/';
            } else if (is_dir('/mnt_host/' . $path[0])) {
                $mount_path = '/mnt_host/';
            } else {
                return null;
            }

            $path = $mount_path . $path[0] . substr($path, 2);
        }

        return $wrapper.$path;
    }
}
