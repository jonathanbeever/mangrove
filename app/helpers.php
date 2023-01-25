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
        return '/rootfs'.$path;
    }
}

if (!function_exists('normalize_path')) {
    /**
     * Convert windows paths to unix paths and substitute /mnt or /mnt_host
     * for non-linux filesystems.
     *
     * Inspired from:
     * https://developer.wordpress.org/reference/functions/wp_normalize_path/
     *
     * @param $path
     * @return string|null
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
        }

        // Non-linux operating systems had the mount path set to /mnt_host
        // or /mnt during testing.
        $rootFolder = explode('/', $path);
        if (array_key_exists(1, $rootFolder)) {
            $rootFolder = $rootFolder[1];
        } else {
            return null;
        }

        if (is_dir(rootfs_path('/host_mnt/'.$rootFolder))) {
            $mountPath = '/host_mnt'.$path;
        } else if (is_dir(rootfs_path('/mnt/'.$rootFolder))) {
            $mountPath = '/mnt'.$path;
        } else if (is_dir(rootfs_path('/'.$rootFolder))) {
            $mountPath = $path;
        } else {
            return null;
        }

        return $wrapper.$mountPath;
    }
}
