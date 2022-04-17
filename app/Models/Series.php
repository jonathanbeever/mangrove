<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Series extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'user_id',
    ];

    /**
     * Get the user the series was created by.
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the site the series is located at.
     *
     * @return BelongsTo
     */
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    /**
     * Get all the files recorded in this series.
     *
     * @return HasMany
     */
    public function files(): HasMany
    {
        return $this->hasMany(File::class);
    }

    /**
     * Get the path where the sound files are located for the series.
     *
     * @return ?string
     */
    public function path(): ?string
    {
        $path = $this->hasOne(File::class)->latestOfMany()->path;

        if (isset($path)) {
            $directory = pathinfo($path, PATHINFO_DIRNAME);
            return rootfs_path($directory);
        }

        return null;
    }

    /**
     * Get all the metadata records for the series.
     *
     * @return HasMany
     */
    public function fileMetadata(): HasMany
    {
        return $this->hasMany(FileMetadata::class);
    }
}
