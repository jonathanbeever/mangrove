<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class ImpersonateController extends Controller
{

    /**
     * Display a listing of users.
     *
     * @return Response
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Index');
    }

    /**
     * Get a paginated object of users.
     *
     * @return LengthAwarePaginator
     */
    public function paginate(): LengthAwarePaginator
    {
        return User::paginate()->withPath('/admin/users/paginate');
    }

    public function store(Request $request)
    {
        $user = User::find($request->user_id);
        session()->put('impersonate', $user->id);
        Session::flash('success', "You are now logged in as {$user->name}");

        return redirect(route('jobs.create'));
    }

    public function destroy()
    {
        session()->forget('impersonate');

        return redirect(route('jobs.create'));
    }
}
