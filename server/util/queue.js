// const express = require('express');
// const mongoose = require('mongoose');
const async = require('async');
const Status = require('../api/models/status');
const { Job } = require('../api/models/job');

const { options } = require('./queue_options');

let q = null;

// Updates status of job in the database
const updateStatus = (job, newStatus) => Job.findByIdAndUpdate(
  job._id,
  { status: newStatus },
  { upsert: true, new: true },
)
  .then(updatedJob => (updatedJob))
  .catch(() => {
    throw new Error(`Failed to update status to ${newStatus}`);
  });

// Construct queue
const intialize = () => {
  q = async.queue((job, callback) => {
    updateStatus(job, Status.PROCESSING)
      .then((queuedJob) => {
        // TODO: replace with actual proccesing later
        const proccessedJob = queuedJob;
        callback(null, proccessedJob);
      })
      .catch((err) => {
        console.log(err, null);
      });
  }, options.cores);

  q.drain = () => { };
};

// Scan for jobs already q'd (in case of sudden shutdown)

// Add job to the queue
// possible race condition to aleviate waiting for worker callback
const qJob = job => new Promise((resolve, reject) => {
  updateStatus(job, Status.QUEUED)
    .then((updatedJob) => {
      const proccessPromise = new Promise((resolveProccess, rejectProccess) => {
        q.push(updatedJob, (err, proccessedJob) => {
          if (err) {
            updateStatus(proccessedJob, Status.FAILED)
              .then(rejectProccess(err))
              .catch(statusFailedErr => rejectProccess(statusFailedErr));
          } else {
            updateStatus(proccessedJob, Status.FINISHED)
              .then((finishedJob) => { resolveProccess(finishedJob); })
              .catch(finishedJobErr => rejectProccess(finishedJobErr));
          }
        });
      });
      resolve({ updatedJob, proccessPromise });
    })
    .catch(err => reject(err));
});

// End job when done proccesing

// Get number of free slots

// Get jobs that are running

// Batch Push function

module.exports = {
  intialize,
  qJob,
};
