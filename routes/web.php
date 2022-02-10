<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
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

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        //'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware([AUTH, 'verified'])->get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::middleware([AUTH, 'verified'])->get('/createjobs', function () {
    return Inertia::render('CreateJobs');
})->name('createjobs');

Route::middleware([AUTH, 'verified'])->get('/results', function () {
    return Inertia::render('Results');
})->name('results');

Route::middleware([AUTH, 'verified'])->get('/queue', function () {
    return Inertia::render('Queue');
})->name('queue');

Route::middleware([AUTH, 'verified'])->get('/about', function () {
    return Inertia::render('About');
})->name('about');
