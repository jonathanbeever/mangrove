<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        'path',
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
     * Get the results for the serires.
     *
     * @return HasMany
     */
    public function results(): HasMany
    {
        return $this->hasMany(Result::class);
    }

    /**
     * Get file by name.
     *
     * @param  string  $fileName
     * @return mixed
     */
    public function fileByName(string $fileName): mixed
    {
        return File::where(['name' => $fileName, 'series_id' => $this->id])->first();
    }

    /**
     * Get all the metadata records for the series.
     *
     * @return HasMany
     */
    public function fileMetadata(): HasMany
    {
        return $this->hasMany(FileMetadata::class)->where('files', '>', '0');
    }
}
