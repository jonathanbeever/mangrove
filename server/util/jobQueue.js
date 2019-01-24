const async = require('async');

const Status = require('../api/models/status');
const { updateJob, getPendingJobs } = require('../api/models/job/utils');
const { options } = require('./queue_options');

function JobQueue() {
  this.queue = null;

  const isInit = () => {
    if (!this.queue) {
      throw new Error('JobQueue has not been initialized.');
    }
  };

  this.enqueue = job => new Promise((resolve, reject) => {
    isInit();


    updateJob(job, { status: Status.QUEUED })
      .then((queuedJob) => {
        if (!queuedJob) {
          return reject(new Error('Job must be made before it is queued'));
        }
        const process = new Promise((resolveProcess, rejectProcess) => {
          this.queue.push(queuedJob, (err, processedJob) => {
            if (err) {
              updateJob(processedJob, { status: Status.FAILED })
                .then(rejectProcess(err))
                .catch(statusFailedErr => rejectProcess(statusFailedErr));
            } else {
              updateJob(processedJob, { status: Status.FINISHED })
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
      updateJob(job, { status: Status.PROCESSING })
        .then((queuedJob) => {
          jobProcessFn(queuedJob)
            .then((processedJob) => {
              callback(null, processedJob);
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    }, options.cores);

    resolve(this.queue);
  });

  const queuePendingJobs = () => new Promise((resolve, reject) => {
    getPendingJobs()
      .then((pendingJobs) => {
        let numJobsQueued = 0;
        if (pendingJobs.length > 0) {
          pendingJobs.forEach(
            (job) => {
              this.enqueue(job)
                .then(() => {
                  numJobsQueued += 1;
                  if (numJobsQueued === pendingJobs.length) { resolve(); }
                })
                .catch(err => reject(err));
            },
          );
        } else {
          resolve();
        }
      })
      .catch(err => reject(err));
  });

  this.init = jobProcessFn => new Promise((resolve, reject) => {
    createQueue(jobProcessFn)
      .then(() => {
        this.queue.drain = () => { };
        this.queue.empty = () => { };
        queuePendingJobs()
          .then(() => { resolve(this.queue); })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });

  this.destroy = () => {
    isInit();

    this.queue.kill();

    this.queue = null;
  };


  this.getFreeSlots = () => {
    isInit();
    if (this.queue.running() < this.queue.concurrency) {
      return this.queue.concurrency - this.queue.running();
    }

    return 0;
  };

  this.getRunningJobs = () => {
    isInit();

    return this.queue.workersList();
  };
}

module.exports = new JobQueue();
