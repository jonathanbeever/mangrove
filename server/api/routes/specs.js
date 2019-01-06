const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const { Spec } = require('../models/spec');
const { validateParam, fillDefaults } = require('../../util/specValidation');

const { getSpecType } = require('../models/specType');

// Create Spec
router.put('/', (req, res) => {
  let SpecModel = null;

  // lets the user use "type" instead of "specType" to add specs.
  const newBody = req.body;
  newBody.specType = newBody.type;
  delete newBody.type;

  SpecModel = getSpecType(newBody.specType);
  if (SpecModel === null) {
    res.status(404).json({ error: 'Not a Supported SpecModel Type' });
  }

  let validatedBody = validateParam(newBody);
  validatedBody = fillDefaults(validatedBody);

  // try to find this spec in the database.
  SpecModel.find({
    // If any of the following model sets are triggered it means that a copy of the
    // model being requested already exists.
    $or: [
      {
        $and: [
          // ACI
          {
            minFreq: { $exists: true },
          },
          {
            maxFreq: { $exists: true },
          },
          {
            j: { $exists: true },
          },
          {
            fftW: { $exists: true },
          },
          {
            dbThreshold: { $exists: false },
          },
          {
            freqStep: { $exists: false },
          },
          {
            shannon: { $exists: false },
          },
          {
            anthroMin: { $exists: false },
          },
          {
            anthroMax: { $exists: false },
          },
          {
            bioMin: { $exists: false },
          },
          {
            bioMax: { $exists: false },
          },
          {
            minFreq: validatedBody.minFreq,
          },
          {
            maxFreq: validatedBody.maxFreq,
          },
          { j: validatedBody.j },
          {
            fftW: validatedBody.fftW,
          },
        ],
      },
      {
        $and: [
          // ADI
          {
            minFreq: { $exists: false },
          },
          {
            maxFreq: { $exists: true },
          },
          {
            j: { $exists: false },
          },
          {
            fftW: { $exists: false },
          },
          {
            dbThreshold: { $exists: true },
          },
          {
            freqStep: { $exists: true },
          },
          {
            shannon: { $exists: true },
          },
          {
            anthroMin: { $exists: false },
          },
          {
            anthroMax: { $exists: false },
          },
          {
            bioMin: { $exists: false },
          },
          {
            bioMax: { $exists: false },
          },
          {
            maxFreq: validatedBody.maxFreq,
          },
          {
            dbThreshold: validatedBody.dbThreshold,
          },
          {
            freqStep: validatedBody.freqStep,
          },
          {
            shannon: validatedBody.shannon,
          },
        ],
      },
      {
        $and: [
          // AEI
          {
            minFreq: { $exists: false },
          },
          {
            maxFreq: { $exists: true },
          },
          {
            j: { $exists: false },
          },
          {
            fftW: { $exists: false },
          },
          {
            dbThreshold: { $exists: true },
          },
          {
            freqStep: { $exists: true },
          },
          {
            shannon: { $exists: false },
          },
          {
            anthroMin: { $exists: false },
          },
          {
            anthroMax: { $exists: false },
          },
          {
            bioMin: { $exists: false },
          },
          {
            bioMax: { $exists: false },
          },
          {
            maxFreq: validatedBody.maxFreq,
          },
          {
            dbThreshold: validatedBody.dbThreshold,
          },
          {
            freqStep: validatedBody.freqStep,
          },
        ],
      },
      {
        $and: [
          // BI
          {
            minFreq: { $exists: true },
          },
          {
            maxFreq: { $exists: true },
          },
          {
            j: { $exists: false },
          },
          {
            fftW: { $exists: true },
          },
          {
            dbThreshold: { $exists: false },
          },
          {
            freqStep: { $exists: false },
          },
          {
            shannon: { $exists: false },
          },
          {
            anthroMin: { $exists: false },
          },
          {
            anthroMax: { $exists: false },
          },
          {
            bioMin: { $exists: false },
          },
          {
            bioMax: { $exists: false },
          },
          {
            minFreq: validatedBody.minFreq,
          },
          {
            maxFreq: validatedBody.maxFreq,
          },
          {
            fftW: validatedBody.fftW,
          },
        ],
      },
      {
        $and: [
          // NDSI
          {
            minFreq: { $exists: false },
          },
          {
            maxFreq: { $exists: false },
          },
          {
            j: { $exists: false },
          },
          {
            fftW: { $exists: true },
          },
          {
            dbThreshold: { $exists: false },
          },
          {
            freqStep: { $exists: false },
          },
          {
            shannon: { $exists: false },
          },
          {
            anthroMin: { $exists: true },
          },
          {
            anthroMax: { $exists: true },
          },
          {
            bioMin: { $exists: true },
          },
          {
            bioMax: { $exists: true },
          },
          {
            fftW: validatedBody.fftW,
          },
          {
            anthroMin: validatedBody.anthroMin,
          },
          {
            anthroMax: validatedBody.anthroMax,
          },
          {
            bioMin: validatedBody.bioMin,
          },
          {
            bioMax: validatedBody.bioMax,
          },
        ],
      },
      // RMS has no param
    ],
  })
    .exec()
    .then((returnSpec) => {
      if (returnSpec.length >= 1) {
        const newResult = returnSpec[0]._doc;
        newResult.specId = newResult._id;
        delete newResult._id;
        delete newResult.__v;

        res.status(200).json(newResult); // if already created then return data object
      } else {
        // add id and creation time to spec document
        validatedBody._id = new mongoose.Types.ObjectId();
        const spec = new SpecModel(
          validatedBody, // Put requested item in a new spec variable
        );
        // save spec
        spec
          .save()
          .then((createResult) => {
            const newResult = createResult._doc;
            newResult.specId = newResult._id;
            delete newResult._id;
            delete newResult.__v;
            res.status(201).json(newResult);
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

router.delete('/', (req, res) => {
  Spec.deleteMany()
    .exec()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
