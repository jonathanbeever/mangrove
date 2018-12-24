const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
// const moment = require('moment');

const {
  Spec,
  AciSpec,
  AdiSpec,
  AeiSpec,
  BiSpec,
  NdsiSpec,
  RmsSpec
} = require("../models/spec");

const { specType } = require("../models/specType");

// Create Spec
router.put("/", (req, res) => {
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
    res.status(404).json({ err: "Not a Supported SpecModel Type" });
  }

  // try to find this spec in the database.
  SpecModel.find({
    $or: [
      {
        //ACI
        minFreq: req.body.minFreq,
        maxFreq: req.body.maxFreq,
        j: req.body.j,
        fftW: req.body.fftW
      },
      {
        //ADI
        maxFreq: req.body.maxFreq,
        dbThreshold: req.body.dbThreshold,
        freqStep: req.body.freqStep,
        shannon: req.body.shannon
      },
      {
        //AEI
        maxFreq: req.body.maxFreq,
        dbThreshold: req.body.dbThreshold,
        freqStep: req.body.freqStep
      },
      {
        //BI
        minFreq: req.body.minFreq,
        maxFreq: req.body.maxFreq,
        fftW: req.body.fftW
      },
      {
        //NDSI
        fftW: req.body.fftW,
        anthroMin: req.body.anthroMin,
        anthroMax: req.body.anthroMax,
        bioMin: req.body.bioMin,
        bioMax: req.body.bioMax
      }
      //RMS has no param
    ]
  })
    .exec()
    .then(returnSpec => {
      if (returnSpec.length >= 1) {
        res.status(200).json({ error: "Item already in database", returnSpec }); // if already created then return data object
      } else {
        // add id and creation time to spec document
        req.body._id = new mongoose.Types.ObjectId();
        // req.body.creationTimeMs = moment().valueOf();
        const spec = new SpecModel(
          req.body // Put requested item in a new spec variable
        );

        // save spec
        spec
          .save()
          .then(createResult => {
            res.status(201).json({
              createResult
            });
          })
          .catch(err => {
            console.log(spec);
            res.status(500).json({
              error: `Error in saving Spec :: ${err}`
            });
          });
      }
    })
    .catch(err => {
      res.status(500).json({ message: `Error in finding Spec :: ${err}` });
    });
});

// Get Spec
router.get("/:specId", (req, res) => {
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
router.get("/", (req, res) => {
  Spec.find()
    .exec()
    .then(searchResult => {
      const count = searchResult.length;
      res.status(200).json({ count, specs: searchResult });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: `Error getting all specs :: ${err}`
      });
    });
});

// TODO Delete Spec

module.exports = router;
