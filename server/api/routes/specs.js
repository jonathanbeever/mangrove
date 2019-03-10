const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const config = require('config');

const { Spec } = require('../models/spec');
const {
  typeToSpecType,
  specTypeToType,
  getSpecModel,
  newSpecKeys,
  getParamsFromSpec,
  validateParams,
  fillDefaultParams,
} = require('../models/spec/utils');
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

  const specType = typeToSpecType(req.body.type);
  const SpecModel = getSpecModel(specType);
  if (!SpecModel) {
    const types = Object.values(Type).join(', ');
    return res.status(400).json({
      message: `Invalid type: ${req.body.type}. Must be one of: ${types}.`,
    });
  }

  const extraKeys = arrayDiff(Object.keys(req.body), newSpecKeys(specType, true));
  if (extraKeys.length > 0) {
    return res.status(400).json({
      message: `Invalid keys for type (${req.body.type}): ${extraKeys.join(', ')}.`,
    });
  }

  const params = getParamsFromSpec(req.body);
  try {
    validateParams(req.body.type, params);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
  const paramsFilled = fillDefaultParams(req.body.type, params);

  try {
    const searchResult = await SpecModel.find(paramsFilled).exec();

    if (searchResult.length /* === 1 */) {
      return res.status(200).json({
        specId: searchResult[0]._id,
        type: specTypeToType(searchResult[0].type),
        ...getParamsFromSpec(searchResult[0]),
      });
    }

    const spec = new SpecModel({
      _id: new mongoose.Types.ObjectId(),
      type: specType,
      ...params,
    });

    const createResult = await Spec.create(spec);

    return res.status(201).json({
      specId: createResult._id,
      type: specTypeToType(createResult.type),
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
      type: specTypeToType(searchResult.type),
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
        type: specTypeToType(spec.type),
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
    const deleteResult = await Spec.deleteOne({ _id: specId }).exec();

    return res.status(200).json({
      success: true,
      message:
      deleteResult.n > 0
        ? `Succesfully deleted Spec with specId: ${specId}`
        : `No valid entry found for specId: ${specId}.`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

module.exports = router;
