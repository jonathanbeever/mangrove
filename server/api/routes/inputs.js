const express = require('express');

const router = express.Router();
const multer = require('multer');
const mkdirp = require('mkdirp');
const config = require('config');

const logger = require('../../util/logger');

const { arrayDiff } = require('../../util/array');
const { getUploadPath } = require('../../util/storage');
const { getAudioMetadata } = require('../../util/audioMetadata');

const DAinputs = require('../../data_access/inputs/DAinputs');

const {
  parseInputJson,
  getNewFilename,
  getExtensionlessFilename,
} = require('../models/input/utils');

const { verify } = require('../../util/verify');

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
  const token = req.get('Authorization');

  const isAllowed = verify(token);
  if (!isAllowed) {
    return res.status(401).json({ error: 'Invalid login' });
  }
  upload.single('file')(req, res, async (uploadErr) => {
    if (uploadErr) {
      if (uploadErr instanceof multer.MulterError) {
        logger.error(uploadErr);
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

      const input = await DAinputs.CreateInput(name, req.file.path, parsedJson, audioMetadata);

      return res.status(201).json(input);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: error.internal });
    }
  });
});

// Get Input
router.get('/:inputId', async (req, res) => {
  const { inputId } = req.params;
  const token = req.get('Authorization');

  try {
    const isAllowed = await verify(token);
    if (!isAllowed) {
      return res.status(401).json({ error: 'Invalid login' });
    }
    const searchResult = await DAinputs.GetInputById(inputId);

    if (!searchResult) {
      return res.status(404).json({
        message: `No valid entry found for inputId: ${inputId}.`,
      });
    }

    return res.status(200).json(searchResult);
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

// Get All Inputs
router.get('/', async (req, res) => {
  const token = req.get('Authorization');

  try {
    const isAllowed = await verify(token);
    if (!isAllowed) {
      return res.status(401).json({ error: 'Invalid login' });
    }

    const searchResult = await DAinputs.GetInputs();

    return res.status(200).json(searchResult);
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

// Delete Input
router.delete('/:inputId', async (req, res) => {
  const { inputId } = req.params;
  const token = req.get('Authorization');

  try {
    const isAllowed = await verify(token);
    if (!isAllowed) {
      return res.status(401).json({ error: 'Invalid login' });
    }

    const deleteResults = await DAinputs.DeleteInput(inputId);
    const { deleteResult, jobsWithInput } = deleteResults;

    return res.status(200).json({
      success: true,
      message: deleteResult
        ? `Successfully deleted Input with inputId: ${inputId}.`
        : `No valid entry found for inputId: ${inputId}.`,
      jobs: jobsWithInput.map(job => job.id),
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

module.exports = router;
