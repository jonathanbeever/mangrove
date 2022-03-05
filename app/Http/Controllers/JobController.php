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
use App\Jobs\ProcessSingleSoundFile;
use App\Models\Job;
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

        return Inertia::render('Jobs', [
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
        $contract->create($request->validated());

        return app(CreateJobResponseContract::class);
    }

    /**
     * Display the specified resource.
     *
     * @param Job $job
     * @return Response
     */
    public function show(Job $job): Response
    {
        return Inertia::render('Jobs/Show', [
            'jobs' => $job
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Job $job
     * @return Response
     */
    public function edit(Job $job): Response
    {
        return Inertia::render('Jobs/Edit', [
            'jobs' => $job
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateJobRequest $request
     * @param Job $job
     * @param UpdateJobContract $contract
     * @return UpdateJobResponseContract
     */
    public function update(UpdateJobRequest $request, Job $job, UpdateJobContract $contract): UpdateJobResponseContract
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
     * @param Job $job
     * @param DeleteJobContract $contract
     * @return DeleteJobResponseContract
     */
    public function destroy(Job $job, DeleteJobContract $contract): DeleteJobResponseContract
    {
        if ($contract->delete($job)) {
            session()->flash('success', 'Successfully deleted promotion!');
        } else {
            session()->flash('failure', 'Failed to delete promotion.');
        }

        return app(DeleteJobResponseContract::class);
    }

    /**
     * Execute the specified resource.
     *
     * @param Job $job
     * @return void
     */
    public function execute(Job $job): void
    {
        ProcessSingleSoundFile::dispatch($job);
    }
}
