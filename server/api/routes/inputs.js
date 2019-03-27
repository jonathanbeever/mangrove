const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const mkdirp = require('mkdirp');
const config = require('config');

const { arrayDiff } = require('../../util/array');
const {
  getUploadPath,
  deleteInputFile,
} = require('../../util/storage');
const { getAudioMetadata } = require('../../util/audioMetadata');

const Input = require('../models/input');
const { Job } = require('../models/job');
const {
  parseInputJson,
  getNewFilename,
  getExtensionlessFilename,
} = require('../models/input/utils');

const error = config.get('error');

const upload = multer({
  fileFilter(req, file, cb) {
    const extraKeys = arrayDiff(Object.keys(req.body), ['json']);
    if (extraKeys.length > 0) {
      cb(new Error(`Invalid keys: ${extraKeys.join(', ')}.`));
    } else if (typeof req.body.json === 'undefined') {
      cb(new Error('Missing required field: json'));
    } else if (file.mimetype !== 'audio/wav' && file.mimetype !== 'audio/wave') {
      cb(new Error(`Invalid MIME type: ${file.mimetype}. Must be audio/wave`));
    } else {
      // TODO: More validation, potentially using Mongoose
      cb(null, true);
    }
  },
  storage: multer.diskStorage({
    destination(req, file, cb) {
      try {
        const parsedJson = parseInputJson(req.body.json);
        const path = getUploadPath(parsedJson);

        // TODO: Check if file already exists
        mkdirp(path, (err) => {
          if (err) {
            cb(err); // FIXME: Handle this error with a 500
          } else {
            cb(null, path);
          }
        });
      } catch (err) {
        cb(err);
      }
    },
    filename(req, file, cb) {
      try {
        const parsedJson = parseInputJson(req.body.json);
        const filename = getNewFilename(parsedJson.recordTimeMs, file.mimetype);
        cb(null, filename);
      } catch (err) {
        cb(err);
      }
    },
  }),
  // limits: { fileSize: 1024 * 1024 * 1024 }, // 1 GB
});

// Create Input
// FIXME: Create Input requests must be sent with the 'file' listed last and
// 'json' listed first, so that we can be sure that we've received the necessary
// path information from req.body.json by the time we're storing the file. This
// is a limitation of the Multer package. See the 'upload' variable above.
router.put('/', (req, res) => {
  upload.single('file')(req, res, async (uploadErr) => {
    if (uploadErr) {
      if (uploadErr instanceof multer.MulterError) {
        console.error(uploadErr);
        return res.status(500).json({ error: error.internal });
      }
      return res.status(400).json({
        message: uploadErr.message,
      });
    }

    if (!req.file) { // No Multer error but still no file
      if (typeof req.body.json === 'undefined') {
        return res.status(400).json({
          message: 'Missing required fields: json, file',
        });
      }
      return res.status(400).json({
        message: 'Missing required field: file',
      });
    }

    try {
      const parsedJson = parseInputJson(req.body.json);
      const audioMetadata = await getAudioMetadata(req.file.path);
      const name = 'name' in parsedJson
        ? parsedJson.name
        : getExtensionlessFilename(req.file.originalname);

      const input = new Input({
        _id: new mongoose.Types.ObjectId(),
        path: req.file.path,
        site: parsedJson.site,
        series: parsedJson.series,
        name,
        recordTimeMs: parsedJson.recordTimeMs,
        durationMs: audioMetadata.durationMs,
        sampleRateHz: audioMetadata.sampleRateHz,
        sizeBytes: audioMetadata.sizeBytes,
        coords: {
          lat: parsedJson.coords.lat,
          long: parsedJson.coords.long,
        },
        downloadUrl: req.file.path, // TODO: Actual download URL
      });

      const createResult = await Input.create(input);

      return res.status(201).json({
        inputId: createResult._id,
        site: createResult.site,
        series: createResult.series,
        name: createResult.name,
        recordTimeMs: createResult.recordTimeMs,
        durationMs: createResult.durationMs,
        sampleRateHz: createResult.sampleRateHz,
        sizeBytes: createResult.sizeBytes,
        coords: {
          lat: createResult.coords.lat,
          long: createResult.coords.long,
        },
        downloadUrl: createResult.downloadUrl, // TODO: Actual download URL
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: error.internal });
    }
  });
});

// Get Input
router.get('/:inputId', async (req, res) => {
  const { inputId } = req.params;

  try {
    const searchResult = await Input.findById(inputId).exec();

    if (!searchResult) {
      return res.status(404).json({
        message: `No valid entry found for inputId: ${inputId}.`,
      });
    }

    return res.status(200).json({
      inputId: searchResult._id,
      site: searchResult.site,
      series: searchResult.series,
      name: searchResult.name,
      recordTimeMs: searchResult.recordTimeMs,
      durationMs: searchResult.durationMs,
      sampleRateHz: searchResult.sampleRateHz,
      sizeBytes: searchResult.sizeBytes,
      coords: {
        lat: searchResult.coords.lat,
        long: searchResult.coords.long,
      },
      downloadUrl: searchResult.downloadUrl, // TODO: Actual download URL
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

// Get All Inputs
router.get('/', async (req, res) => {
  try {
    const searchResult = await Input.find().exec();

    return res.status(200).json({
      count: searchResult.length,
      inputs: searchResult.map(input => ({
        inputId: input._id,
        site: input.site,
        series: input.series,
        name: input.name,
        recordTimeMs: input.recordTimeMs,
        durationMs: input.durationMs,
        sampleRateHz: input.sampleRateHz,
        sizeBytes: input.sizeBytes,
        coords: {
          lat: input.coords.lat,
          long: input.coords.long,
        },
        downloadUrl: input.downloadUrl, // TODO: Actual download link
      })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

// Delete Input
router.delete('/:inputId', async (req, res) => {
  const { inputId } = req.params;

  try {
    const deleteResult = await Input.findOneAndDelete({ _id: inputId }).exec();
    if (deleteResult) deleteInputFile(deleteResult.path);

    let jobsWithInput = [];
    if (deleteResult) {
      jobsWithInput = await Job.find({ input: inputId });
      await Job.deleteMany({ input: inputId });
    }

    return res.status(200).json({
      success: true,
      message: deleteResult
        ? `Successfully deleted Input with inputId: ${inputId}.`
        : `No valid entry found for inputId: ${inputId}.`,
      jobs: jobsWithInput.map(job => job.id),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

module.exports = router;
