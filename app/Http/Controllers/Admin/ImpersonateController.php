<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
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
}
