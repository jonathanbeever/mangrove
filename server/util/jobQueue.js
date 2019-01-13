const async = require('async');

const Status = require('../api/models/status');
const { updateStatus } = require('../api/models/job/utils');

const { options } = require('./queue_options');

function JobQueue() {
  this.queue = null;

  this.init = (jobProcessFn) => {
    this.queue = async.queue((job, callback) => {
      updateStatus(job, Status.PROCESSING)
        .then((queuedJob) => {
          const processedJob = jobProcessFn(queuedJob);
          callback(null, processedJob);
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

    updateStatus(job, Status.QUEUED)
      .then((queuedJob) => {
        const process = new Promise((resolveProcess, rejectProcess) => {
          this.queue.push(queuedJob, (err, processedJob) => {
            if (err) {
              updateStatus(processedJob, Status.FAILED)
                .then(rejectProcess(err))
                .catch(statusFailedErr => rejectProcess(statusFailedErr));
            } else {
              updateStatus(processedJob, Status.FINISHED)
                .then((finishedJob) => { resolveProcess(finishedJob); })
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
