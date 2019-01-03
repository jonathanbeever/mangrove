const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const { Spec } = require('../models/spec');
const { specDefaults } = require('../models/specDefaults');
const { validateParam } = require('../../util/specValidation');

const { getSpecType } = require('../models/specType');

// Create Spec
router.put('/', (req, res) => {
  let SpecModel = null;

  const validatedBody = validateParam(req.body);
  SpecModel = getSpecType(validatedBody.specType);

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
              { minFreq: specDefaults.aci.minFreq.default }
            ]
          },
          {
            $or: [
              { fftW: { $exists: true } },
              { fftW: specDefaults.aci.fftW.default }
            ]
          },
          {
            $or: [
              { maxFreq: { $exists: true } },
              { fftW: specDefaults.aci.maxFreq.default }
            ]
          },
          {
            $or: [{ j: { $exists: true } }, { j: specDefaults.aci.j.default }]
          },
          {
            $or: [
              { minFreq: validatedBody.minFreq },
              { minFreq: specDefaults.aci.minFreq.default }
            ]
          },
          {
            $or: [
              { maxFreq: validatedBody.maxFreq },
              { maxFreq: specDefaults.aci.maxFreq.default }
            ]
          },
          { $or: [{ j: validatedBody.j }, { j: specDefaults.aci.j.default }] },
          {
            $or: [
              { fftW: validatedBody.fftW },
              { fftW: specDefaults.aci.fftW.default }
            ]
          }
        ]
      },
      {
        $and: [
          // ADI
          {
            $or: [
              { maxFreq: validatedBody.maxFreq },
              { maxFreq: specDefaults.adi.maxFreq.default }
            ]
          },
          {
            $or: [
              { dbThreshold: validatedBody.dbThreshold },
              { dbThreshold: specDefaults.adi.dbThreshold.default }
            ]
          },
          {
            $or: [
              { freqStep: validatedBody.freqStep },
              { freqStep: specDefaults.adi.freqStep.default }
            ]
          },
          {
            $or: [
              { shannon: validatedBody.shannon },
              { shannon: specDefaults.adi.shannon.default }
            ]
          },
          {
            $or: [
              { maxFreq: { $exists: true } },
              { maxFreq: specDefaults.adi.maxFreq.default }
            ]
          },
          {
            $or: [
              { dbThreshold: { $exists: true } },
              { dbThreshold: specDefaults.adi.dbThreshold.default }
            ]
          },
          {
            $or: [
              { freqStep: { $exists: true } },
              { freqStep: specDefaults.adi.freqStep.default }
            ]
          },
          {
            $or: [
              { shannon: { $exists: true } },
              { shannon: specDefaults.adi.shannon.default }
            ]
          }
        ]
      },
      {
        $and: [
          // AEI
          {
            $or: [
              { maxFreq: validatedBody.maxFreq },
              { maxFreq: specDefaults.aei.maxFreq.default }
            ]
          },
          {
            $or: [
              { dbThreshold: validatedBody.dbThreshold },
              { dbThreshold: specDefaults.aei.dbThreshold.default }
            ]
          },
          {
            $or: [
              { freqStep: validatedBody.freqStep },
              { freqStep: specDefaults.aei.freqStep.default }
            ]
          },
          {
            $or: [
              { maxFreq: { $exists: true } },
              { maxFreq: specDefaults.aei.maxFreq.default }
            ]
          },
          {
            $or: [
              { dbThreshold: { $exists: true } },
              { dbThreshold: specDefaults.aei.dbThreshold.default }
            ]
          },
          {
            $or: [
              { freqStep: { $exists: true } },
              { freqStep: specDefaults.aei.freqStep.default }
            ]
          }
        ]
      },
      {
        $and: [
          // BI
          {
            $or: [
              { minFreq: validatedBody.minFreq },
              { minFreq: specDefaults.bi.minFreq.default }
            ]
          },
          {
            $or: [
              { maxFreq: validatedBody.maxFreq },
              { maxFreq: specDefaults.bi.maxFreq.default }
            ]
          },
          {
            $or: [
              { fftW: validatedBody.fftW },
              { fftW: specDefaults.bi.fftW.default }
            ]
          },
          {
            $or: [
              { minFreq: { $exists: true } },
              { minFreq: specDefaults.bi.minFreq.default }
            ]
          },
          {
            $or: [
              { maxFreq: { $exists: true } },
              { maxFreq: specDefaults.bi.maxFreq.default }
            ]
          },
          {
            $or: [
              { fftW: { $exists: true } },
              { fftW: specDefaults.bi.fftW.default }
            ]
          }
        ]
      },
      {
        $and: [
          // NDSI
          {
            $or: [
              { fftW: validatedBody.fftW },
              { fftW: specDefaults.ndsi.fftW.default }
            ]
          },
          {
            $or: [
              { anthroMin: validatedBody.anthroMin },
              { anthroMin: specDefaults.ndsi.anthroMin.default }
            ]
          },
          {
            $or: [
              { anthroMax: validatedBody.anthroMax },
              { anthroMax: specDefaults.ndsi.anthroMax.default }
            ]
          },
          {
            $or: [
              { bioMin: validatedBody.bioMin },
              { bioMin: specDefaults.ndsi.bioMin.default }
            ]
          },
          {
            $or: [
              { bioMax: validatedBody.bioMax },
              { bioMax: specDefaults.ndsi.bioMax.default }
            ]
          },
          {
            $or: [
              { fftW: { $exists: true } },
              { fftW: specDefaults.ndsi.fftW.default }
            ]
          },
          {
            $or: [
              { anthroMin: { $exists: true } },
              { anthroMin: specDefaults.ndsi.anthroMin.default }
            ]
          },
          {
            $or: [
              { anthroMax: { $exists: true } },
              { anthroMax: specDefaults.ndsi.anthroMax.default }
            ]
          },
          {
            $or: [
              { bioMin: { $exists: true } },
              { bioMin: specDefaults.ndsi.bioMin.default }
            ]
          },
          {
            $or: [
              { bioMax: { $exists: true } },
              { bioMax: specDefaults.ndsi.bioMax.default }
            ]
          }
        ]
      }
      // RMS has no param
    ]
  })
    .exec()
    .then(returnSpec => {
      if (returnSpec.length >= 1) {
        res.status(200).json(returnSpec[0]); // if already created then return data object
      } else {
        // add id and creation time to spec document
        validatedBody._id = new mongoose.Types.ObjectId();
        const spec = new SpecModel(
          validatedBody // Put requested item in a new spec variable
        );
        // save spec
        spec
          .save()
          .then(createResult => {
            const newResult = createResult;
            // newResult.specId = createResult._id;
            // delete newResult[_id];
            // delete newResult[__v];
            res.status(201).json(newResult);
          })
          .catch(err => {
            res.status(500).json({
              error: `Error in saving Spec :: ${err}`
            });
          });
      }
    })
    .catch(err => {
      res.status(500).json({ error: `Error in finding Spec :: ${err}` });
    });
});

// Get Spec
router.get('/:specId', (req, res) => {
  const { specId } = req.params;

  Spec.findById(specId)
    .exec()
    .then(searchResult => {
      if (searchResult) {
        res.status(200).json(searchResult);
      } else {
        res.status(404).json({
          error: `No valid entry found for ${specId}`
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: `Error searching for specId :: ${err}` });
    });
});

// Get All Specs
router.get('/', (req, res) => {
  Spec.find()
    .exec()
    .then(searchResult => {
      const count = searchResult.length;
      res.status(200).json({ count, specs: searchResult });
    })
    .catch(err => {
      res.status(500).json({
        error: `Error getting all specs :: ${err}`
      });
    });
});

// TODO Delete Spec
router.delete('/:specId', (req, res) => {
  const { specId } = req.params;
  Spec.deleteOne({ _id: specId })
    .exec()
    .then(deleteResult => {
      res.status(200).json({
        success: true,
        message:
          deleteResult.n > 0
            ? `Succesfully deleted Spec with specId: ${specId}`
            : `No valid entry found for specId: ${specId}.`
      });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.delete('/', (req, res) => {
  Spec.deleteMany()
    .exec()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;
