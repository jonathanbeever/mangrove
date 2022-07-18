<?php

namespace App\Http\Responses\Job;

use App\Contracts\Job\CreateJobResponseContract;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CreateJobResponse implements CreateJobResponseContract
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
