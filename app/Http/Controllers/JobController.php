<?php

namespace App\Http\Controllers;

use App\Contracts\Job\CreateJobContract;
use App\Contracts\Job\CreateJobResponseContract;
use App\Contracts\Job\DeleteJobContract;
use App\Contracts\Job\DeleteJobResponseContract;
use App\Http\Requests\Job\StoreJobRequest;
use App\Jobs\ProcessSoundData;
use App\Models\JobInput;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(): Response
    {
        $jobs = auth()->user()?->jobs()->with(['series.results'])->get()->toArray();

        return Inertia::render('Jobs/Index', [
            'jobs' => $jobs
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  StoreJobRequest  $request
     * @param  CreateJobContract  $contract
     * @return CreateJobResponseContract
     */
    public function store(StoreJobRequest $request, CreateJobContract $contract): CreateJobResponseContract
    {
        $job = $contract->create($request->validated());

        if ($job !== null) {
            $this->queueJob($job);
            session()->flash('success', 'Successfully created and queued job!');
        } else {
            session()->flash('failure', 'Failed to create job.');
        }

        return app(CreateJobResponseContract::class);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create(): Response
    {
        $user = auth()->user();
        if ($user !== null) {
            $sites = $user->sites->toArray();
            $series = $user->series->toArray();
        }

        return Inertia::render('Jobs/Create', [
            'sites' => $sites ?? [],
            'series' => $series ?? [],
        ]);
    }

    /**
     * Queue the specified job to be executed.
     *
     * @param  JobInput  $job
     * @return void
     */
    public function queueJob(JobInput $job): void
    {
        ProcessSoundData::dispatch($job, auth()->user());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  JobInput  $job
     * @param  DeleteJobContract  $contract
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
     * Show the results page.
     *
     * @return Response
     */
    public function results(): Response
    {
        $user = auth()->user();
        if ($user !== null) {
            $sites = $user->sites()->with(['series.results', 'series.fileMetadata'])->get()->toArray();
        }

        return Inertia::render('Jobs/Results', [
            'sites' => $sites ?? [],
        ]);
    }

    public function statuses(Request $request): JsonResponse
    {
        $currentStatuses = $request->input('currentStatuses');

        $jobStatuses = auth()->user()?->jobs()->pluck('status', 'id');

        return response()->json([
            'statuses' => $jobStatuses
        ]);
    }

}
