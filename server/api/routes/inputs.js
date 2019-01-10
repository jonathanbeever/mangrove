const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const mkdirp = require('mkdirp');
const settings = require('../../util/settings');

const Input = require('../models/input');

const inputDir = settings.value('inputDir');
const getUploadPath = json => `${inputDir}/${json.site}/${json.series}`;

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
// router.get('/:inputId', (req, res) => {
// });

// Get All Inputs
// router.get('/', (req, res) => {
// });

// Delete Input
// router.delete('/:inputId', (req, res) => {
// });

module.exports = router;
