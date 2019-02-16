const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

const { Job } = require('../models/job');
const {
  getJobModel,
  newJobKeys,
} = require('../models/job/utils');
const Status = require('../models/status');
const Type = require('../models/type');

const { arrayDiff } = require('../../util/array');


// Create Job
router.put('/', (req, res) => {
  const missingKeys = arrayDiff(newJobKeys(), Object.keys(req.body));
  if (missingKeys.length > 0) {
    return res.status(400).json({
      message: `Missing required keys: ${missingKeys.join(', ')}.`,
    });
  }

  const extraKeys = arrayDiff(Object.keys(req.body), newJobKeys());
  if (extraKeys.length > 0) {
    return res.status(400).json({
      message: `Invalid keys: ${extraKeys.join(', ')}.`,
    });
  }

  let JobModel;

  try {
    JobModel = getJobModel(req.body.type);
  } catch (err) {
    const types = Object.values(Type).join(', ');
    return res.status(400).json({
      message: `Invalid type: ${req.body.type}. Must be one of: ${types}.`,
    });
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
          ...(searchResult[0].status === Status.FINISHED && {
            result: searchResult[0].result,
          }),
        });
      } else {
        const job = new JobModel({
          _id: new mongoose.Types.ObjectId(),
          type: req.body.type,
          input: req.body.inputId,
          spec: req.body.specId,
          author: 'Test Author', // TODO: Implement user authentication
          creationTimeMs: moment().valueOf(),
          status: Status.WAITING, // TODO: Implement job queueing
        });

        Job.create(job)
          .then(async (createResult) => {
            try {
              const enqueueResult = await global.jobQueue.enqueue(createResult);

              res.status(201).json({
                jobId: enqueueResult._id,
                type: enqueueResult.type,
                input: enqueueResult.input,
                spec: enqueueResult.spec,
                author: enqueueResult.author,
                creationTimeMs: enqueueResult.creationTimeMs,
                status: enqueueResult.status,
              });
            } catch (err) {
              console.log('Error in Job Put Route');
              res.status(500).json({ error: err });
            }
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
          ...(searchResult.status === Status.FINISHED && {
            result: searchResult.result,
          }),
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
          ...(job.status === Status.FINISHED && {
            result: job.result,
          }),
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

  Job.deleteOne({ _id: jobId })
    .exec()
    .then((deleteResult) => {
      res.status(200).json({
        success: true,
        message:
          deleteResult.n > 0
            ? `Successfully deleted Job with jobId: ${jobId}.`
            : `No valid entry found for jobId: ${jobId}.`,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
