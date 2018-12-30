const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
// const moment = require('moment');

const {
  Spec,
  AciSpec,
  AdiSpec,
  AeiSpec,
  BiSpec,
  NdsiSpec,
  RmsSpec,
} = require('../models/spec');

const { specType } = require('../models/specType');

// Create Spec
router.put('/', (req, res) => {
  let SpecModel = null;
  switch (req.body.specType) {
    case specType.ACI:
      SpecModel = AciSpec;
      break;
    case specType.ADI:
      SpecModel = AdiSpec;
      break;
    case specType.AEI:
      SpecModel = AeiSpec;
      break;
    case specType.BI:
      SpecModel = BiSpec;
      break;
    case specType.NDSI:
      SpecModel = NdsiSpec;
      break;
    case specType.RMS:
      SpecModel = RmsSpec;
      break;
    default:
      SpecModel = null;
      break;
  }

  if (SpecModel === null) {
    res.status(404).json({ error: 'Not a Supported SpecModel Type' });
  }
  // try to find this spec in the database.
  SpecModel.find({
    $or: [
      {
        $and: [
          // ACI
          { minFreq: { $exists: true } },
          { fftW: { $exists: true } },
          { maxFreq: { $exists: true } },
          { j: { $exists: true } },
          { minFreq: req.body.minFreq },
          { maxFreq: req.body.maxFreq },
          { j: req.body.j },
          { fftW: req.body.fftW },
        ],
      },
      // ADD EXISTS TOO THE REST OF THESE CASES
      {
        $and: [
          // ADI
          { maxFreq: req.body.maxFreq },
          { dbThreshold: req.body.dbThreshold },
          { freqStep: req.body.freqStep },
          { shannon: req.body.shannon },
          { maxFreq: { $exists: true } },
          { dbThreshold: { $exists: true } },
          { freqStep: { $exists: true } },
          { shannon: { $exists: true } },
        ],
      },
      {
        $and: [
          // AEI
          { maxFreq: req.body.maxFreq },
          { dbThreshold: req.body.dbThreshold },
          { freqStep: req.body.freqStep },
          { maxFreq: { $exists: true } },
          { dbThreshold: { $exists: true } },
          { freqStep: { $exists: true } },
        ],
      },
      {
        $and: [
          // BI
          { minFreq: req.body.minFreq },
          { maxFreq: req.body.maxFreq },
          { fftW: req.body.fftW },
          { minFreq: { $exists: true } },
          { maxFreq: { $exists: true } },
          { fftW: { $exists: true } },
        ],
      },
      {
        $and: [
          // NDSI
          { fftW: req.body.fftW },
          { anthroMin: req.body.anthroMin },
          { anthroMax: req.body.anthroMax },
          { bioMin: req.body.bioMin },
          { bioMax: req.body.bioMax },
          { fftW: { $exists: true } },
          { anthroMin: { $exists: true } },
          { anthroMax: { $exists: true } },
          { bioMin: { $exists: true } },
          { bioMax: { $exists: true } },
        ],
      },
      // RMS has no param
    ],
  })
    .exec()
    .then((returnSpec) => {
      if (returnSpec.length >= 1) {
        res.status(200).json(returnSpec[0]); // if already created then return data object
      } else {
        // add id and creation time to spec document
        req.body._id = new mongoose.Types.ObjectId();
        // req.body.creationTimeMs = moment().valueOf();
        const spec = new SpecModel(
          req.body, // Put requested item in a new spec variable
        );

        // save spec
        spec
          .save()
          .then((createResult) => {
            res.status(201).json(createResult);
          })
          .catch((err) => {
            res.status(500).json({
              error: `Error in saving Spec :: ${err}`,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: `Error in finding Spec :: ${err}` });
    });
});

// Get Spec
router.get('/:specId', (req, res) => {
  const { specId } = req.params;

  Spec.findById(specId)
    .exec()
    .then((searchResult) => {
      if (searchResult) {
        res.status(200).json(searchResult);
      } else {
        res.status(404).json({
          error: `No valid entry found for ${specId}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: `Error searching for specId :: ${err}` });
    });
});

// Get All Specs
router.get('/', (req, res) => {
  Spec.find()
    .exec()
    .then((searchResult) => {
      const count = searchResult.length;
      res.status(200).json({ count, specs: searchResult });
    })
    .catch((err) => {
      res.status(500).json({
        error: `Error getting all specs :: ${err}`,
      });
    });
});

// TODO Delete Spec
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
      res.status(500).json({ error: err });
    });
});

module.exports = router;
