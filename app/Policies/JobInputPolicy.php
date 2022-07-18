<?php

namespace App\Policies;

use App\Models\JobInput;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class JobInputPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  User  $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  User  $user
     * @param  JobInput  $job
     * @return bool
     */
    public function view(User $user, JobInput $job): bool
    {
        return $user->id === $job->user_id;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  User  $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  User  $user
     * @param  JobInput  $job
     * @return bool
     */
    public function update(User $user, JobInput $job): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  User  $user
     * @param  JobInput  $job
     * @return bool
     */
    public function delete(User $user, JobInput $job): bool
    {
        return $user->id === $job->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  User  $user
     * @param  JobInput  $job
     * @return bool
     */
    public function restore(User $user, JobInput $job): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  User  $user
     * @param  JobInput  $job
     * @return bool
     */
    public function forceDelete(User $user, JobInput $job): bool
    {
        return false;
    }
}
