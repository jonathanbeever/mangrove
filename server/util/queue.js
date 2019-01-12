// const express = require('express');
// const mongoose = require('mongoose');
const async = require('async');
const Status = require('../api/models/status');
const { Job } = require('../api/models/job');

const { options } = require('./queue_options');

let q = null;
const qHistory = {};

let trackHistory = false;

// actviate track history
const setTrack = (activate) => {
  trackHistory = activate;
};

const getHistory = () => qHistory;

// adding History
const addHistory = (id, status) => {
  if (!(id in qHistory)) {
    qHistory[id] = [];
  }
  qHistory[id].push(status);
};

// Updates status of job in the database
const updateStatus = (job, newStatus) => Job.findByIdAndUpdate(
  job._id,
  { status: newStatus },
  { upsert: true, new: true },
)
  .then((updatedJob) => {
    if (trackHistory) {
      addHistory(updatedJob._id, updatedJob.status);
    }
    console.log('UPDATED JOB');
    console.log(updatedJob);
    return updatedJob;
  })
  .catch(() => {
    if (trackHistory) {
      addHistory(job._id, `${newStatus} failed`);
    }

    throw new Error(`Failed to update status to ${newStatus}`);
  });

// Construct queue
const intialize = () => {
  q = async.queue((job, callback) => {
    updateStatus(job, Status.PROCESSING)
      .then(() => {
        // I make a promise that calls the proccesing or proccesing itself is a promise
        callback();
      })
      .catch((err) => {
        console.log(err);
      });
  }, options.cores);

  q.drain = () => { };
};

// Scan for jobs already q'd (in case of sudden shutdown)

const test1 = new Promise(() => {
  console.log('1st');
  return { first: 1 };
});

const test2 = new Promise(() => {
  console.log('2nd');
  return { second: 2 };
});

// Add job to the queue
// possible race condition to aleviate waiting for worker callback
const qJob = job => updateStatus(job._id, Status.QUEUED)
  .then(() => Promise.race([test1, test2]))
  .catch((err) => { console.log(err); })
  .then(() => {
    console.log('wow');
  })
  .catch((err) => {
    updateStatus(job, Status.FAILED)
      .then(() => {
        console.log(`Error in proccesing job ${job._id} with error:: ${err}`);
      })
      .catch((error) => {
        console.log(`Status update "FAILED" has thrown error:: ${error}`);
      });
  });

// End job when done proccesing

// Get number of free slots

// Get jobs that are running

// Batch Push function
/* q.push(updatedJob, (err) => {
  if (err) {
    updateStatus(updatedJob, Status.FAILED)
      .then(() => {
        console.log(
          `Error in proccesing updatedJob ${
            updatedJob._id
          } with error:: ${err}`,
        );
      })
      .catch((error) => {
        console.log(
          `Status update "FAILED" has thrown error:: ${error}`,
        );
      });
  } else {
    updateStatus(updatedJob, Status.FINISHED)
      .then(() => { })
      .catch((error) => {
        console.log(error);
      });
  }
}) */
module.exports = {
  intialize,
  qJob,
  setTrack,
  getHistory,
};
