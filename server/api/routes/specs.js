const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const config = require('config');

const { Spec } = require('../models/spec');
const {
  getSpecModel,
  newSpecKeys,
  getParamsFromSpec,
  fillDefaultParams,
} = require('../models/spec/utils');
const { getJobModel } = require('../models/job/utils');
const Type = require('../models/type');

const { arrayDiff } = require('../../util/array');

const error = config.get('error');

// Create Spec
router.put('/', async (req, res) => {
  const missingKeys = arrayDiff(newSpecKeys(), Object.keys(req.body));
  if (missingKeys.length > 0) {
    return res.status(400).json({
      message: `Missing required keys: ${missingKeys.join(', ')}.`,
    });
  }

  let SpecModel;
  try {
    SpecModel = getSpecModel(req.body.type);
  } catch (err) {
    const types = Object.values(Type).join(', ');
    return res.status(400).json({
      message: `Invalid type: ${req.body.type}. Must be one of: ${types}.`,
    });
  }

  const extraKeys = arrayDiff(Object.keys(req.body), newSpecKeys(req.body.type, true));
  if (extraKeys.length > 0) {
    return res.status(400).json({
      message: `Invalid keys for type (${req.body.type}): ${extraKeys.join(', ')}.`,
    });
  }

  try {
    const params = getParamsFromSpec(req.body);
    const spec = new SpecModel({
      _id: new mongoose.Types.ObjectId(),
      ...params,
    });

    const validationErr = spec.validateSync();
    if (validationErr) {
      return res.status(400).json({
        message: Object.values(validationErr.errors).map(e => e.message).join(' '),
      });
    }

    const paramsFilled = fillDefaultParams(req.body.type, params);
    const searchResult = await SpecModel.find(paramsFilled).exec();

    if (searchResult.length /* === 1 */) {
      return res.status(200).json({
        specId: searchResult[0]._id,
        type: searchResult[0].type,
        ...getParamsFromSpec(searchResult[0]),
      });
    }

    const createResult = await Spec.create(spec);

    return res.status(201).json({
      specId: createResult._id,
      type: createResult.type,
      ...getParamsFromSpec(createResult),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

// Get Spec
router.get('/:specId', async (req, res) => {
  const { specId } = req.params;

  try {
    const searchResult = await Spec.findById(specId).exec();

    if (!searchResult) {
      return res.status(404).json({
        message: `No valid entry found for ${specId}`,
      });
    }

    return res.status(200).json({
      specId: searchResult._id,
      type: searchResult.type,
      ...getParamsFromSpec(searchResult),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

// Get All Specs
router.get('/', async (req, res) => {
  try {
    const searchResult = await Spec.find().exec();

    return res.status(200).json({
      count: searchResult.length,
      specs: searchResult.map(spec => ({
        specId: spec._id,
        type: spec.type,
        ...getParamsFromSpec(spec),
      })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

// Delete Spec
router.delete('/:specId', async (req, res) => {
  const { specId } = req.params;

  try {
    const deleteResult = await Spec.findOneAndDelete({ _id: specId }).exec();

    let jobsWithSpec = [];
    if (deleteResult) {
      const JobModel = getJobModel(deleteResult.type);
      jobsWithSpec = await JobModel.find({ spec: specId });
      await JobModel.deleteMany({ spec: specId });
    }

    return res.status(200).json({
      success: true,
      message: deleteResult
        ? `Successfully deleted Spec with specId: ${specId}`
        : `No valid entry found for specId: ${specId}.`,
      jobs: jobsWithSpec.map(job => job.id),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

module.exports = router;
