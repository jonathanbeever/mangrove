const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

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

// Create Spec
router.put('/', (req, res) => {
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
    return res.status(400).json({
      message: err.message,
    });
  }

  SpecModel.find(fillDefaultParams(req.body.type, params))
    .exec()
    .then((searchResult) => {
      if (searchResult.length /* === 1 */) {
        res.status(200).json({
          specId: searchResult[0]._id,
          type: specTypeToType(searchResult[0].type),
          ...getParamsFromSpec(searchResult[0]),
        });
      } else {
        const spec = new SpecModel({
          _id: new mongoose.Types.ObjectId(),
          type: specType,
          ...params,
        });

        spec
          .save()
          .then((createResult) => {
            res.status(201).json({
              specId: createResult._id,
              type: specTypeToType(createResult.type),
              ...getParamsFromSpec(createResult),
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

// Get Spec
router.get('/:specId', (req, res) => {
  const { specId } = req.params;

  Spec.findById(specId)
    .exec()
    .then((searchResult) => {
      if (searchResult) {
        res.status(200).json({
          specId: searchResult._id,
          type: specTypeToType(searchResult.type),
          ...getParamsFromSpec(searchResult),
        });
      } else {
        res.status(404).json({
          message: `No valid entry found for ${specId}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Get All Specs
router.get('/', (req, res) => {
  Spec.find()
    .exec()
    .then((searchResult) => {
      res.status(200).json({
        count: searchResult.length,
        specs: searchResult.map(spec => ({
          specId: spec._id,
          type: specTypeToType(spec.type),
          ...getParamsFromSpec(spec),
        })),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Delete Spec
router.delete('/:specId', (req, res) => {
  const { specId } = req.params;
  Spec.deleteOne({ _id: specId })
    .exec()
    .then((deleteResult) => {
      res.status(200).json({
        success: true,
        message:
          deleteResult.n > 0
            ? `Succesfully deleted Spec with specId: ${specId}`
            : `No valid entry found for specId: ${specId}.`,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
