const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

const {
  Job, AciJob, AdiJob, AeiJob, BiJob, NdsiJob, RmsJob,
} = require('../models/job');
const Type = require('../models/type');
const Status = require('../models/status');

// Create Job
router.put('/', (req, res) => {
  let JobModel = null;
  switch (req.body.type) {
    case Type.ACI:
      JobModel = AciJob;
      break;
    case Type.ADI:
      JobModel = AdiJob;
      break;
    case Type.AEI:
      JobModel = AeiJob;
      break;
    case Type.BI:
      JobModel = BiJob;
      break;
    case Type.NDSI:
      JobModel = NdsiJob;
      break;
    case Type.RMS:
      JobModel = RmsJob;
      break;
    default:
      // TODO: Decide what to do here
      break;
  }

  JobModel.find({
    input: req.body.inputId,
    spec: req.body.specId,
  })
    .exec()
    .then((searchResult) => {
      if (searchResult.length /* === 1 */) {
        res.status(200).json({
          jobId: searchResult[0]._id,
          type: searchResult[0].type,
          input: searchResult[0].input,
          spec: searchResult[0].spec,
          author: searchResult[0].author,
          creationTimeMs: searchResult[0].creationTimeMs,
          status: searchResult[0].status,
        });
      } else {
        const job = new JobModel({
          _id: new mongoose.Types.ObjectId(),
          type: req.body.type,
          input: req.body.inputId,
          spec: req.body.specId,
          author: 'Test Author', // TODO: Implement user authentication
          creationTimeMs: moment().valueOf(),
          status: Status.QUEUED, // TODO: Implement job queueing
        });

        job
          .save()
          .then((createResult) => {
            res.status(201).json({
              jobId: createResult._id,
              type: createResult.type,
              input: createResult.input,
              spec: createResult.spec,
              author: createResult.author,
              creationTimeMs: createResult.creationTimeMs,
              status: createResult.status,
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Get Job
router.get('/:jobId', (req, res) => {
  const { jobId } = req.params;

  Job.findById(jobId)
    .exec()
    .then((searchResult) => {
      if (searchResult) {
        res.status(200).json({
          jobId: searchResult._id,
          type: searchResult.type,
          input: searchResult.input,
          spec: searchResult.spec,
          author: searchResult.author,
          creationTimeMs: searchResult.creationTimeMs,
          status: searchResult.status,
        });
      } else {
        res.status(404).json({
          message: `No valid entry found for jobId: ${jobId}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Get All Jobs
router.get('/', (req, res) => {
  Job.find()
    .exec()
    .then((searchResult) => {
      res.status(200).json({
        count: searchResult.length,
        jobs: searchResult.map(job => ({
          jobId: job._id,
          type: job.type,
          input: job.input,
          spec: job.spec,
          author: job.author,
          creationTimeMs: job.creationTimeMs,
          status: job.status,
        })),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Delete Job
router.delete('/:jobId', (req, res) => {
  const { jobId } = req.params;

  Job.remove({ _id: jobId })
    .exec()
    .then((deleteResult) => {
      res.status(200).json({
        success: true,
        message: (
          deleteResult.n > 0
            ? `Successfully deleted Job with jobId: ${jobId}.`
            : `No valid entry found for jobId: ${jobId}.`
        ),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
