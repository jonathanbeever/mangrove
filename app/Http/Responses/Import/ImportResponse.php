<?php

namespace App\Http\Responses\Import;

use App\Contracts\Import\ImportResponseContract;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ImportResponse implements ImportResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  Request  $request
     * @return Response
     */
    public function toResponse($request): Response
    {
        return redirect()->to(route('jobs.create'));
    }
}
