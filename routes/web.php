<?php

use App\Http\Controllers\Admin\ImpersonateController;
use App\Http\Controllers\ImportController;
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

// Default Role Routes
Route::middleware([
    'auth:web',
    config('jetstream.auth_session'),
    'verified',
])->group(static function () {
    Route::resource('jobs', JobController::class)->except(['show', 'edit', 'update']);
    Route::get('/import', [ImportController::class, 'create']);
    Route::post('/import', [ImportController::class, 'import']);

    Route::get('/about', static function () {
        return Inertia::render('About');
    })->name('about');

    Route::impersonate();
});

// Admin Role Routes
Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
    'admin'
])->group(static function () {
    Route::get('/admin', [ImpersonateController::class, 'index'])->name('admin.index');
    Route::get('/admin/users/paginate', [ImpersonateController::class, 'paginate'])->name('admin.users.paginate');
});
