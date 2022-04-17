<?php

namespace App\Providers;

use App\Actions\Import;
use App\Actions\Job\CreateJob;
use App\Actions\Job\DeleteJob;
use App\Actions\Job\ExecuteJob;
use App\Actions\Job\UpdateJob;
use App\Contracts\Import\ImportContract;
use App\Contracts\Import\ImportResponseContract;
use App\Contracts\Job\CreateJobContract;
use App\Contracts\Job\CreateJobResponseContract;
use App\Contracts\Job\DeleteJobContract;
use App\Contracts\Job\DeleteJobResponseContract;
use App\Contracts\Job\ExecuteJobContract;
use App\Contracts\Job\UpdateJobContract;
use App\Contracts\Job\UpdateJobResponseContract;
use App\Http\Responses\ImportResponse;
use App\Http\Responses\Job\CreateJobResponse;
use App\Http\Responses\Job\DeleteJobResponse;
use App\Http\Responses\Job\UpdateJobResponse;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        // Jobs
        $this->app->singleton(CreateJobContract::class, CreateJob::class);
        $this->app->singleton(CreateJobResponseContract::class, CreateJobResponse::class);
        $this->app->singleton(UpdateJobContract::class, UpdateJob::class);
        $this->app->singleton(UpdateJobResponseContract::class, UpdateJobResponse::class);
        $this->app->singleton(DeleteJobContract::class, DeleteJob::class);
        $this->app->singleton(DeleteJobResponseContract::class, DeleteJobResponse::class);
        $this->app->singleton(ExecuteJobContract::class, ExecuteJob::class);

        // Import
        $this->app->singleton(ImportContract::class, Import::class);
        $this->app->singleton(ImportResponseContract::class, ImportResponse::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
