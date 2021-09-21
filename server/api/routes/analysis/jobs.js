const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
const config = require('config');

const logger = require('../../../util/logger');

const { Job } = require('../../models/job');
const { Spec } = require('../../models/spec');
const Input = require('../../models/input');
const {
  getJobModel,
  newJobKeys,
} = require('../../models/job/utils');
const Status = require('../../models/status');

const { arrayDiff } = require('../../../util/array');
const { verify, getUser } = require('../../../util/verify');

const error = config.get('error');

router.get('/hello', async (req, res) => res.status(200).json(
  {
    hello: 'world',
  },
));

// Create Job
router.put('/', async (req, res) => {
  const token = req.get('Authorization');

  const isAllowed = await verify(token);
  if (!isAllowed) {
    return res.status(401).json({ error: 'Invalid login' });
  }

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

  let input;
  let spec;
  try {
    input = await Input.findById(req.body.input).exec();
    if (!input) {
      return res.status(404).json({
        message: `Unable to find Input with ID ${req.body.input}`,
      });
    }

    spec = await Spec.findById(req.body.spec).exec();
    if (!spec) {
      return res.status(404).json({
        message: `Unable to find Spec with ID ${req.body.spec}`,
      });
    }
  } catch (err) {
    return res.status(400).json({ message: 'Invalid spec and/or input' });
  }

  try {
    const JobModel = getJobModel(spec.type);
    const searchResult = await JobModel.find({
      input: req.body.input,
      spec: req.body.spec,
    }).exec();

    if (searchResult.length /* === 1 */) {
      return res.status(200).json({
        jobId: searchResult[0]._id,
        input: searchResult[0].input,
        spec: searchResult[0].spec,
        author: searchResult[0].author,
        creationTimeMs: searchResult[0].creationTimeMs,
        status: searchResult[0].status,
        ...(searchResult[0].status === Status.FINISHED && {
          result: searchResult[0].result,
        }),
      });
    }

    const username = await getUser(token);
    const job = new JobModel({
      _id: new mongoose.Types.ObjectId(),
      input: input.id,
      spec: spec.id,
      author: username,
      creationTimeMs: moment().valueOf(),
      status: Status.WAITING,
    });

    const createResult = await Job.create(job);
    const enqueueResult = await global.jobQueue.enqueue(createResult);

    return res.status(201).json({
      jobId: enqueueResult._id,
      input: enqueueResult.input,
      spec: enqueueResult.spec,
      author: enqueueResult.author,
      creationTimeMs: enqueueResult.creationTimeMs,
      status: enqueueResult.status,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

// Get Job
router.get('/:jobId', async (req, res) => {
  const { jobId } = req.params;
  const token = req.get('Authorization');

  try {
    const isAllowed = await verify(token);
    if (!isAllowed) {
      return res.status(401).json({ error: 'Invalid login' });
    }
    const searchResult = await Job.findById(jobId).exec();

    if (!searchResult) {
      return res.status(404).json({
        message: `No valid entry found for jobId: ${jobId}.`,
      });
    }

    return res.status(200).json({
      jobId: searchResult._id,
      input: searchResult.input,
      spec: searchResult.spec,
      author: searchResult.author,
      creationTimeMs: searchResult.creationTimeMs,
      status: searchResult.status,
      ...(searchResult.status === Status.FINISHED && {
        result: searchResult.result,
      }),
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

// Get All Jobs
router.get('/', async (req, res) => {
  const token = req.get('Authorization');

  try {
    const isAllowed = await verify(token);
    if (!isAllowed) {
      return res.status(401).json({ error: 'Invalid login' });
    }
    const searchResult = await Job.find().exec();

    return res.status(200).json({
      count: searchResult.length,
      jobs: searchResult.map(job => ({
        jobId: job._id,
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
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

// Delete Job
router.delete('/:jobId', async (req, res) => {
  const { jobId } = req.params;
  const token = req.get('Authorization');

  try {
    const isAllowed = await verify(token);
    if (!isAllowed) {
      return res.status(401).json({ error: 'Invalid login' });
    }
    const deleteResult = await Job.deleteOne({ _id: jobId }).exec();

    return res.status(200).json({
      success: true,
      message:
      deleteResult.n > 0
        ? `Successfully deleted Job with jobId: ${jobId}.`
        : `No valid entry found for jobId: ${jobId}.`,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

module.exports = router;
