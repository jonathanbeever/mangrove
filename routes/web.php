<?php

use App\Http\Controllers\JobController;
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

Route::get('/', static function () {
    if(auth()->check()) {
        return redirect()->route('jobs.create');
    }

    return Inertia::render('Auth/Login');
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(static function () {
    Route::resource('jobs', JobController::class);

    Route::get('/about', static function () {
        return Inertia::render('About');
    })->name('about');
});
