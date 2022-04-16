<?php

namespace App\Http\Controllers;

use App\Contracts\Import\ImportContract;
use App\Contracts\Import\ImportResponseContract;
use App\Http\Requests\ImportRequest;
use Inertia\Inertia;
use Inertia\Response;

class ImportController extends Controller
{
    /**
     * Show the form for creating a new import.
     *
     * @return Response
     */
    public function create(): Response
    {
        $user = auth()->user();
        if ($user !== null) {
            $sites = $user->sites();
            $series = $user->series();
        }

        return Inertia::render('Import/Index', [
            'sites' => $sites ?? [],
            'series' => $series ?? [],
        ]);
    }

    /**
     * Store all the imported data to the database.
     *
     * @param  ImportRequest  $request
     * @param  ImportContract  $contract
     * @return ImportResponseContract
     */
    public function import(ImportRequest $request, ImportContract $contract): ImportResponseContract
    {
        $imported = $contract->import($request->validated());

        if ($imported) {
            session()->flash('success', 'Successfully imported data.');
        } else {
            session()->flash('failure', 'Failed to import data.');
        }

        return app(ImportResponseContract::class);
    }
}
