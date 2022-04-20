<?php

namespace App\Enums\Job;

enum JobStatusEnum: int
{
    case QUEUED = 0;
    case RUNNING = 1;
    case SUCCEEDED = 2;
    case FAILED = 3;
}
