<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJobRequest;
use App\Http\Requests\UpdateJobRequest;
use App\Models\Job;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
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

        return Inertia::render('Jobs', $jobs);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('Jobs/create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreJobRequest $request
     * @return RedirectResponse
     */
    public function store(StoreJobRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $job = new Job($validated);

        if ($job->save()) {
            session()->flash('success', 'Successfully created job!');
        } else {
            session()->flash('failure', 'Failed to create job.');
        }

        return redirect()->route('jobs');
    }

    /**
     * Display the specified resource.
     *
     * @param Job $id
     * @return Response|RedirectResponse
     */
    public function show(Job $id): Response|RedirectResponse
    {
        $jobs = auth()->user()?->jobs();

        try {
            $job = $jobs->findOrFail($id);
        } catch (ModelNotFoundException) {
            session()->flash('failure', 'Could not find job.');
            return redirect()->route('jobs');
        }

        return Inertia::render('Jobs/create', [
            'job' => $job,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Job $id
     * @return Response|RedirectResponse
     */
    public function edit(Job $id): Response|RedirectResponse
    {
        $jobs = auth()->user()?->jobs();

        try {
            $job = $jobs->findOrFail($id);
        } catch (ModelNotFoundException) {
            session()->flash('failure', 'Could not find job.');
            return redirect()->route('jobs');
        }

        return Inertia::render('Jobs/edit', [
            'job' => $job,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateJobRequest $request
     * @param Job $id
     * @return RedirectResponse
     */
    public function update(UpdateJobRequest $request, Job $id): RedirectResponse
    {
        $validated = $request->validated();
        $jobs = auth()->user()?->jobs();

        try {
            $job = $jobs->findOrFail($id);
        } catch (ModelNotFoundException) {
            session()->flash('failure', 'Could not find job.');
            return redirect()->route('jobs');
        }

        $job->fill($validated);

        if ($job->save()) {
            session()->flash('success', 'Successfully created job!');
        } else {
            session()->flash('failure', 'Failed to create job.');
        }

        return redirect()->route('jobs');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Job $id
     * @return RedirectResponse
     */
    public function destroy(Job $id): RedirectResponse
    {
        $jobs = auth()->user()?->jobs();

        try {
            $job = $jobs->findOrFail($id);
        } catch (ModelNotFoundException) {
            session()->flash('failure', 'Could not find job.');
            return redirect()->route('jobs');
        }

        if ($job->delete()) {
            session()->flash('success', 'Successfully deleted job!');
        } else {
            session()->flash('failure', 'Failed to delete job.');
        }

        return redirect()->route('jobs');
    }

    public function runJob(Job $id): void
    {
        $aci_job = [
            'input' => [
                'path' => 'wav/test.wav',
                'site' => 'UCF Arboretum',
                'series' => 'Hurricane Irma',
                'name' => 'Test Input',
                'recordTimeMs' => 1505016000000,
                'durationMs' => 30000,
                'sampleRateHz' => 44100,
                'sizeBytes' => 5292044,
                'coords' => [
                    'lat' => 28.596238,
                    'long' => -81.191381
                ],
                'downloadUrl' => 'file:wav/test.wav'
            ],
            'spec' => [
                'type' => 'bi',
                'minFreq' => 2000,
                'maxFreq' => 8000,
                'fftW' => 32,
            ],
        ];

        try {
            $json = json_encode($aci_job, JSON_THROW_ON_ERROR);

            $handle = popen('Rscript ../scripts/Rscripts/processJob.R \'' . $json . '\' 2>&1', "r");
            while(!feof($handle)) {
                echo '<pre>' . fread($handle, 4096) . '</pre>';
                ob_flush();
            }
            pclose($handle);
        } catch (\Exception ) {
            dd('Input could not be parsed to JSON');
        }
    }
}
