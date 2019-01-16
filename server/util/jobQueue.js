const async = require('async');

const Status = require('../api/models/status');
const { getJobModel } = require('../api/models/job/utils');
const { options } = require('./queue_options');
const { Job } = require('../api/models/job');


const updateJob = (job) => {
  const JobModel = getJobModel(job.type);

  return JobModel.findByIdAndUpdate(
    job._id,
    job,
    { new: true },
  )
    .then(updatedJob => updatedJob)
    .catch(() => {
      throw new Error(`Failed to update status to ${job.status}`);
    });
};

const orderBasedonStatus = (jobs) => {
  const proccesingJobs = [];
  const queuedJobs = [];
  const waitingJobs = [];

  jobs.forEach((job) => {
    if (job.status === Status.PROCESSING) {
      proccesingJobs.push(job);
    } else if (job.status === Status.QUEUED) {
      queuedJobs.push(job);
    } else if (job.status === Status.WAITING) {
      waitingJobs.push(job);
    }
  });

  return proccesingJobs.concat(queuedJobs).concat(waitingJobs);
};

const getAwaitingJobs = () => Job
  .find({ status: { $in: [Status.QUEUED, Status.PROCESSING, Status.WAITING] } })
  .then((waitingJobs) => {
    const ordered = orderBasedonStatus(waitingJobs);
    return ordered;
  })
  .catch(err => new Error(err));


function JobQueue() {
  this.queue = null;


  this.enqueue = job => new Promise((resolve, reject) => {
    if (!this.queue) {
      throw new Error('JobQueue has not been initialized.');
    }

    Object.assign(job, { status: Status.QUEUED });
    updateJob(job)
      .then((queuedJob) => {
        const process = new Promise((resolveProcess, rejectProcess) => {
          this.queue.push(queuedJob, (err, processedJob) => {
            if (err) {
              Object.assign(processedJob, { status: Status.FAILED });
              updateJob(processedJob)
                .then(rejectProcess(err))
                .catch(statusFailedErr => rejectProcess(statusFailedErr));
            } else {
              Object.assign(processedJob, { status: Status.FINISHED });
              updateJob(processedJob)
                .then((finishedJob) => {
                  resolveProcess(finishedJob);
                })
                .catch(finishedJobErr => rejectProcess(finishedJobErr));
            }
          });
        });

        resolve({
          job: queuedJob,
          process,
        });
      })
      .catch(err => reject(err));
  });


  const createQueue = jobProcessFn => new Promise((resolve, reject) => {
    this.queue = async.queue((job, callback) => {
      Object.assign(job, { status: Status.PROCESSING });
      updateJob(job)
        .then((queuedJob) => {
          jobProcessFn(queuedJob)
            .then((processedJob) => {
              callback(null, processedJob);
            })
            .catch(err => reject(err));
        })
        .catch((err) => {
          reject(err);
        });
    }, options.cores);

    resolve(this.queue);
  });

  const queueAwaitingJobs = () => new Promise((resolve, reject) => {
    getAwaitingJobs()
      .then((awaitingJobs) => {
        let numJobsQueued = 0;
        awaitingJobs.forEach(
          (job) => {
            this.enqueue(job)
              .then(() => {
                numJobsQueued += 1;
                if (numJobsQueued === awaitingJobs.length) { resolve(); }
              })
              .catch(err => reject(err));
          },
        );
      })
      .catch(err => reject(new Error(err)));
  });

  this.init = jobProcessFn => new Promise((resolve, reject) => {
    createQueue(jobProcessFn)
      .then(() => {
        this.queue.drain = () => { };
        queueAwaitingJobs()
          .then(() => { resolve(this.queue); })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });

  this.uninit = () => {
    this.queue.kill();
  };


  // Get number of free slots

  // Get jobs that are running

  // Batch Push function
}

module.exports = new JobQueue();
