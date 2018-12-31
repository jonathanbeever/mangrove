const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

const {
  Spec,
  AciSpec,
  AdiSpec,
  AeiSpec,
  BiSpec,
  NdsiSpec,
  RmsSpec,
} = require('../models/spec');

const { specDefaults } = require('../models/specDefaults');

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
    // If any of the following model sets are triggered it means that a copy of the
    // model being requested already exists.
    $or: [
      {
        $and: [
          // ACI
          {
            // Checks to see if the value exists or is a default within the
            $or: [
              { minFreq: { $exists: true } },
              { minFreq: specDefaults.aci.minFreq },
            ],
          },
          {
            $or: [{ fftW: { $exists: true } }, { fftW: specDefaults.aci.fftW }],
          },
          {
            $or: [
              { maxFreq: { $exists: true } },
              { fftW: specDefaults.aci.maxFreq },
            ],
          },
          { $or: [{ j: { $exists: true } }, { j: specDefaults.aci.j }] },
          {
            $or: [
              { minFreq: req.body.minFreq },
              { minFreq: specDefaults.aci.minFreq },
            ],
          },
          {
            $or: [
              { maxFreq: req.body.maxFreq },
              { maxFreq: specDefaults.aci.maxFreq },
            ],
          },
          { $or: [{ j: req.body.j }, { j: specDefaults.aci.j }] },
          { $or: [{ fftW: req.body.fftW }, { fftW: specDefaults.aci.fftW }] },
        ],
      },
      {
        $and: [
          // ADI
          {
            $or: [
              { maxFreq: req.body.maxFreq },
              { maxFreq: specDefaults.adi.maxFreq },
            ],
          },
          {
            $or: [
              { dbThreshold: req.body.dbThreshold },
              { dbThreshold: specDefaults.adi.dbThreshold },
            ],
          },
          {
            $or: [
              { freqStep: req.body.freqStep },
              { freqStep: specDefaults.adi.freqStep },
            ],
          },
          {
            $or: [
              { shannon: req.body.shannon },
              { shannon: specDefaults.adi.shannon },
            ],
          },
          {
            $or: [
              { maxFreq: { $exists: true } },
              { maxFreq: specDefaults.adi.maxFreq },
            ],
          },
          {
            $or: [
              { dbThreshold: { $exists: true } },
              { dbThreshold: specDefaults.adi.dbThreshold },
            ],
          },
          {
            $or: [
              { freqStep: { $exists: true } },
              { freqStep: specDefaults.adi.freqStep },
            ],
          },
          {
            $or: [
              { shannon: { $exists: true } },
              { shannon: specDefaults.adi.shannon },
            ],
          },
        ],
      },
      {
        $and: [
          // AEI
          {
            $or: [
              { maxFreq: req.body.maxFreq },
              { maxFreq: specDefaults.aei.maxFreq },
            ],
          },
          {
            $or: [
              { dbThreshold: req.body.dbThreshold },
              { dbThreshold: specDefaults.aei.dbThreshold },
            ],
          },
          {
            $or: [
              { freqStep: req.body.freqStep },
              { freqStep: specDefaults.aei.freqStep },
            ],
          },
          {
            $or: [
              { maxFreq: { $exists: true } },
              { maxFreq: specDefaults.aei.maxFreq },
            ],
          },
          {
            $or: [
              { dbThreshold: { $exists: true } },
              { dbThreshold: specDefaults.aei.dbThreshold },
            ],
          },
          {
            $or: [
              { freqStep: { $exists: true } },
              { freqStep: specDefaults.aei.freqStep },
            ],
          },
        ],
      },
      {
        $and: [
          // BI
          {
            $or: [
              { minFreq: req.body.minFreq },
              { minFreq: specDefaults.bi.minFreq },
            ],
          },
          {
            $or: [
              { maxFreq: req.body.maxFreq },
              { maxFreq: specDefaults.bi.maxFreq },
            ],
          },
          { $or: [{ fftW: req.body.fftW }, { fftW: specDefaults.bi.fftW }] },
          {
            $or: [
              { minFreq: { $exists: true } },
              { minFreq: specDefaults.bi.minFreq },
            ],
          },
          {
            $or: [
              { maxFreq: { $exists: true } },
              { maxFreq: specDefaults.bi.maxFreq },
            ],
          },
          { $or: [{ fftW: { $exists: true } }, { fftW: specDefaults.bi.fftW }] },
        ],
      },
      {
        $and: [
          // NDSI
          { $or: [{ fftW: req.body.fftW }, { fftW: specDefaults.ndsi.fftW }] },
          {
            $or: [
              { anthroMin: req.body.anthroMin },
              { anthroMin: specDefaults.ndsi.anthroMin },
            ],
          },
          {
            $or: [
              { anthroMax: req.body.anthroMax },
              { anthroMax: specDefaults.ndsi.anthroMax },
            ],
          },
          {
            $or: [
              { bioMin: req.body.bioMin },
              { bioMin: specDefaults.ndsi.bioMin },
            ],
          },
          {
            $or: [
              { bioMax: req.body.bioMax },
              { bioMax: specDefaults.ndsi.bioMax },
            ],
          },
          {
            $or: [{ fftW: { $exists: true } }, { fftW: specDefaults.ndsi.fftW }],
          },
          {
            $or: [
              { anthroMin: { $exists: true } },
              { anthroMin: specDefaults.ndsi.anthroMin },
            ],
          },
          {
            $or: [
              { anthroMax: { $exists: true } },
              { anthroMax: specDefaults.ndsi.anthroMax },
            ],
          },
          {
            $or: [
              { bioMin: { $exists: true } },
              { bioMin: specDefaults.ndsi.bioMin },
            ],
          },
          {
            $or: [
              { bioMax: { $exists: true } },
              { bioMax: specDefaults.ndsi.bioMax },
            ],
          },
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
            res.status(201).json({ createResult, test: AciSpec });
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
