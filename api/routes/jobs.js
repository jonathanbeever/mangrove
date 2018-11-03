const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

const Job = require('../models/job');

// Create Job
router.put('/', (req, res) => {
  Job.find({
    inputId: req.body.input,
    jobSpecId: req.body.jobSpec,
  }).exec()
    .then((searchResult) => {
      console.log(searchResult);
      if (searchResult.length) {
        res.status(200).json(searchResult[0]);
      } else {
        const job = new Job({
          _id: new mongoose.Types.ObjectId(),
          author: 'Test Author', // TODO: Implement user authentication
          inputId: req.body.input,
          jobSpecId: req.body.jobSpec,
          creationTimeMs: moment().valueOf(),
          status: 'queued', // TODO: Implement job queueing
        });

        job
          .save()
          .then((createResult) => {
            console.log(createResult);
          })
          .catch(err => console.log(err));

        res.status(201).json({
          job,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Get Job
router.get('/:jobId', (req, res) => {
  const { jobId } = req.params.jobId;

  Job.findById(jobId)
    .exec()
    .then((searchResult) => {
      console.log(searchResult);
      if (searchResult) {
        res.status(200).json(searchResult);
      } else {
        res.status(404).json({
          message: 'No valid entry found for provided jobId.',
        });
      }
    })
    .catch((err) => {
      console.log(err);
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
      console.log(searchResult);
      res.status(200).json({
        jobs: searchResult,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Delete Job
router.delete('/:jobId', (req, res) => {
  const { jobId } = req.params.jobId;

  Job.remove({ _id: jobId })
    .exec()
    .then((deleteResult) => {
      console.log(deleteResult);
      res.status(200).json(deleteResult);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
