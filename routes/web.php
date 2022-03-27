<?php

use App\Http\Controllers\JobController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

const AUTH = 'auth:sanctum';

Route::get('/', static function () {
    if(auth()->check()) {
        return redirect()->route('jobs.create');
    }

    return Inertia::render('Auth/Login');
});

Route::group(['middleware' => [AUTH, 'verified']], static function () {
    Route::resource('jobs', JobController::class);

    Route::get('/about', static function () {
        return Inertia::render('About');
    })->name('about');

    Route::get('/dashboard', static function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/results', static function () {
        return Inertia::render('Results');
    })->name('results');

    Route::get('/queue', static function () {
        return Inertia::render('Queue');
    })->name('queue');

    Route::get('/sound/{file}', static function ($file) {
        return File::get('../sounds/' . $file);
    })->name('sound');

    Route::get('/sound-data', static function () {
        return File::get('../sounds/acousticindex.csv');
    })->name('sound-data');
});

Route::get('/run', [JobController::class, 'queueSingleFileJob']);
