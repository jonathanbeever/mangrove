const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const mkdirp = require('mkdirp');

const {
  getUploadPath,
  deleteInputFile,
} = require('../../util/storage');

const Input = require('../models/input');

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      const json = JSON.parse(req.body.json);
      const path = getUploadPath(json);
      mkdirp(path, (err) => {
        if (err) {
          console.error(err);
        } else {
          cb(null, path);
        }
      });
    },
    filename(req, file, cb) {
      // TODO: Rename to `${json.recordTimeMs}.wav`
      cb(null, file.originalname);
    },
  }),
  // limits: { fileSize: 1024 * 1024 * 1024 }, // 1 GB
  fileFilter(req, file, cb) {
    if (file.mimetype === 'audio/wave') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

// Create Input
// FIXME: Create Input requests must be sent with the 'file' listed last and
// 'json' listed first, so that we can be sure that we've received the necessary
// path information from req.body.json by the time we're storing the file. This
// is a limitation of the Multer package. See the 'upload' variable above.
router.put('/', upload.single('file'), (req, res) => {
  const json = JSON.parse(req.body.json);
  const input = new Input({
    _id: new mongoose.Types.ObjectId(),
    path: req.file.path,
    site: json.site,
    series: json.series,
    recordTimeMs: json.recordTimeMs,
    coords: {
      lat: json.coords.lat,
      long: json.coords.long,
    },
  });

  input
    .save()
    .then((createResult) => {
      res.status(201).json({
        inputId: createResult._id,
        path: createResult.path,
        site: createResult.site,
        series: createResult.series,
        recordTimeMs: createResult.recordTimeMs,
        coords: {
          lat: createResult.coords.lat,
          long: createResult.coords.long,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Get Input
router.get('/:inputId', (req, res) => {
  const { inputId } = req.params;

  Input.findById(inputId)
    .exec()
    .then((searchResult) => {
      if (searchResult) {
        res.status(200).json({
          inputId: searchResult._id,
          path: searchResult.path,
          site: searchResult.site,
          series: searchResult.series,
          recordTimeMs: searchResult.recordTimeMs,
          coords: {
            lat: searchResult.coords.lat,
            long: searchResult.coords.long,
          },
        });
      } else {
        res.status(404).json({
          message: `No valid entry found for inputId: ${inputId}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Get All Inputs
router.get('/', (req, res) => {
  Input.find()
    .exec()
    .then((searchResult) => {
      res.status(200).json({
        count: searchResult.length,
        inputs: searchResult.map(input => ({
          inputId: input._id,
          path: input.path,
          site: input.site,
          series: input.series,
          recordTimeMs: input.recordTimeMs,
          coords: {
            lat: input.coords.lat,
            long: input.coords.long,
          },
        })),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Delete Input
// TODO: Delete Jobs associated with the Input
router.delete('/:inputId', (req, res) => {
  const { inputId } = req.params;

  Input.findById(inputId)
    .exec()
    .then((searchResult) => {
      Input.deleteOne({ _id: inputId })
        .exec()
        .then((deleteResult) => {
          if (searchResult) deleteInputFile(searchResult.path);

          res.status(200).json({
            success: true,
            message: (
              deleteResult.n > 0
                ? `Successfully deleted Input with inputId: ${inputId}.`
                : `No valid entry found for inputId: ${inputId}.`
            ),
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
