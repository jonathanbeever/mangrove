<?php

namespace App\Http\Responses\Job;

use App\Contracts\Job\DeleteJobResponseContract;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DeleteJobResponse implements DeleteJobResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  Request  $request
     * @return Response
     */
    public function toResponse($request): Response
    {
        return redirect()->to('jobs');
    }
}
