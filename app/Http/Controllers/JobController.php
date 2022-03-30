<?php

namespace App\Http\Controllers;

use App\Contracts\Job\CreateJobContract;
use App\Contracts\Job\CreateJobResponseContract;
use App\Contracts\Job\DeleteJobContract;
use App\Contracts\Job\DeleteJobResponseContract;
use App\Contracts\Job\UpdateJobContract;
use App\Contracts\Job\UpdateJobResponseContract;
use App\Http\Requests\Job\StoreJobRequest;
use App\Http\Requests\Job\UpdateJobRequest;
use App\Jobs\ProcessSoundData;
use App\Models\JobInput;
use Inertia\Inertia;
use Inertia\Response;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(): Response
    {
        $jobs = auth()->user()->jobs;

        return Inertia::render('Jobs/Index', [
            'jobs' => $jobs
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('Jobs/Create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreJobRequest $request
     * @param CreateJobContract $contract
     * @return CreateJobResponseContract
     */
    public function store(StoreJobRequest $request, CreateJobContract $contract): CreateJobResponseContract
    {
        $job = $contract->create($request->validated());

        if ($job !== NULL) {
            $this->queueJob($job);
            session()->flash('success', 'Successfully created and queued job!');
        } else {
            session()->flash('failure', 'Failed to create job.');
        }

        return app(CreateJobResponseContract::class);
    }

    /**
     * Display the specified resource.
     *
     * @param JobInput $job
     * @return Response
     */
    public function show(JobInput $job): Response
    {
        return Inertia::render('Jobs/Results', [
            'jobs' => $job
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param JobInput $job
     * @return Response
     */
    public function edit(JobInput $job): Response
    {
        return Inertia::render('Jobs/Edit', [
            'jobs' => $job
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateJobRequest $request
     * @param JobInput $job
     * @param UpdateJobContract $contract
     * @return UpdateJobResponseContract
     */
    public function update(UpdateJobRequest $request, JobInput $job, UpdateJobContract $contract): UpdateJobResponseContract
    {
        if ($contract->update($request->validated(), $job)) {
            session()->flash('success', 'Successfully updated job!');
        } else {
            session()->flash('failure', 'Failed to update job.');
        }

        return app(UpdateJobResponseContract::class);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param JobInput $job
     * @param DeleteJobContract $contract
     * @return DeleteJobResponseContract
     */
    public function destroy(JobInput $job, DeleteJobContract $contract): DeleteJobResponseContract
    {
        if ($contract->delete($job)) {
            session()->flash('success', 'Successfully deleted job!');
        } else {
            session()->flash('failure', 'Failed to delete job.');
        }

        return app(DeleteJobResponseContract::class);
    }

    /**
     * Queue the specified job to be executed.
     *
     * @param JobInput $job
     * @return void
     */
    public function queueJob(JobInput $job): void
    {
        ProcessSoundData::dispatch($job);
    }
}
