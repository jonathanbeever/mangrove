const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

const {
  Spec, AciSpec, AdiSpec, AeiSpec, BiSpec, NdsiSpec, RmsSpec,
} = require('../models/spec');

// Create Spec
router.put('/', (req, res) => {
  let SpecModel = null;
  console.log(req.body.specType);
  switch (req.body.specType) {
    case 'aciSpec':
      SpecModel = AciSpec;
      break;
    case 'adiSpec':
      SpecModel = AdiSpec;
      break;
    case 'aeiSpec':
      SpecModel = AeiSpec;
      break;
    case 'biSpec':
      SpecModel = BiSpec;
      break;
    case 'ndsiSpec':
      SpecModel = NdsiSpec;
      break;
    case 'rmsSpec':
      SpecModel = RmsSpec;
      break;
    default:
      SpecModel = null;
      break;
  }

  if (SpecModel === null) {
    res.status(404).json({ err: 'Not a Supported SpecModel Type' });
  }

  // try to find this spec in the database.
  SpecModel.find({
    ...((SpecModel === AciSpec || SpecModel === BiSpec) && {
      minFreq: req.body.minFreq,
    },
    // ACI/ADI/AEI/BI maxFreq Check
    (SpecModel === AciSpec
      || SpecModel === AdiSpec
      || SpecModel === AeiSpec
      || SpecModel === BiSpec) && { maxFreq: req.body.maxFreq },
    // ACI j Check
    SpecModel === AciSpec && { j: req.body.j },
    // ACI/BI/NDSI fftW Check
    (SpecModel === AciSpec
      || SpecModel === BiSpec
      || SpecModel === NdsiSpec) && { fftW: req.body.fftW },
    // ADI/AEI dbThreshold Check
    (SpecModel === AdiSpec || SpecModel === AeiSpec) && {
      dbThreshold: req.body.dbThreshold,
    },
    // ADI/AEI freqStep Check
    (SpecModel === AdiSpec || SpecModel === AeiSpec) && {
      freqStep: req.body.freqStep,
    },
    // ADI shannon Check
    SpecModel === AdiSpec && { shannon: req.body.shannon },
    // NDSI anthroMin Check
    SpecModel === NdsiSpec && { anthroMin: req.body.anthroMin },
    // NDSI anthroMax Check
    SpecModel === NdsiSpec && { anthroMax: req.body.anthroMax },
    // NDSI bioMin Check
    SpecModel === NdsiSpec && { bioMin: req.body.bioMin },
    // NDSI bioMax Check
    SpecModel === NdsiSpec && { bioMax: req.body.bioMax }),
  })
    .exec()
    .then((returnSpec) => {
      if (returnSpec.length >= 1) {
        res.status(200).json({ error: 'Item already in database', returnSpec }); // if already created then return data object
      } else {
        // add id and creation time to spec document
        req.body._id = new mongoose.Types.ObjectId();
        req.body.creationTimeMs = moment().valueOf();

        const spec = new SpecModel(
          req.body, // Put requested item in a new spec variable
        );

        // save spec
        spec
          .save()
          .then((createResult) => {
            res.status(201).json({
              createResult,
            });
          })
          .catch((err) => {
            console.log(spec);
            res.status(500).json({
              error: `Error in saving Spec :: ${err}`,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: `Error in finding Spec :: ${err}` });
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
          searchResult,
        });
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
      console.log(err);
      res.status(500).json({
        error: `Error getting all specs :: ${err}`,
      });
    });
});

// Delete Spec

module.exports = router;
