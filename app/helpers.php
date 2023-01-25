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
        // Also, store drive letter for later use.
        $driveLetter = null;
        if (':' === $path[1]) {
            $path = lcfirst($path);
            $driveLetter = $path[0];
        }

        // Split the path into an array of path segments, so we can grab the root folder.
        $rootFolder = explode('/', $path);
        if (isset($rootFolder[1])) {
            $rootFolder = $rootFolder[1];
        } else {
            return null;
        }

        // Check if the root folder is in a docker mount point.
        $mountPath = null;
        foreach (['host_mnt', 'mnt'] as $mount) {
            if (is_dir(rootfs_path('/'.$mount.'/'.$rootFolder))) {
                $mountPath = '/'.$mount.$path;
                break;
            // If the root folder is not in the mount point, check if the drive letter is for windows.
            } elseif ($driveLetter !== null && is_dir(rootfs_path('/'.$mount.'/'.$driveLetter.'/'.$rootFolder))) {
                // Use substr to remove the windows formatted drive letter from the path.
                $mountPath = '/'.$mount.'/'.$driveLetter.substr($path, 2);
                break;
            }
        }

        // Check if the root folder is in the rootfs without a mount point.
        if ($mountPath === null && is_dir(rootfs_path('/'.$rootFolder))) {
            $mountPath = $path;
        }

        // If the root folder is not in the rootfs, return null.
        if ($mountPath === null) {
            return null;
        }

        return $wrapper.$mountPath;
    }
}
