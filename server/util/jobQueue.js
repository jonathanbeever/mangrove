const async = require('async');

const Status = require('../api/models/status');
const { getJobModel } = require('../api/models/job/utils');
const { options } = require('./queue_options');


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

function JobQueue() {
  this.queue = null;


  this.init = (jobProcessFn) => {
    this.queue = async.queue((job, callback) => {
      Object.assign(job, { status: Status.PROCESSING });
      updateJob(job)
        .then((queuedJob) => {
          jobProcessFn(queuedJob)
            .then((processedJob) => {
              callback(null, processedJob);
            });
        })
        .catch((err) => {
          console.log(err, null);
        });
    }, options.cores);

    this.queue.drain = () => { };

    // TODO: Scan for queued/processing Jobs (recover from unexpected shutdown)
  };

  this.push = job => new Promise((resolve, reject) => {
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

  // End job when done procesing

  // Get number of free slots

  // Get jobs that are running

  // Batch Push function
}

module.exports = new JobQueue();
