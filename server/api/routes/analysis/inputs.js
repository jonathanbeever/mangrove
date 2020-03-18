const express = require('express');

const config = require('config');
const multer = require('multer');
const mkdirp = require('mkdirp');

const error = config.get('error');

const router = express.Router();

const DaInputs = require('../../../data_access/inputs/daInputs');
const logger = require('../../../util/logger');

const {
  parseInputJson,
  getNewFilename,
} = require('../../models/input/utils');
const { arrayDiff } = require('../../../util/array');
const { getUploadPath } = require('../../../util/storage');
const { verify } = require('../../../util/verify');

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
router.put('/', async (req, res) => {
  const token = req.get('Authorization');

  const isAllowed = verify(token);
  if (!isAllowed) {
    return res.status(401).json({ error: 'Invalid login' });
  }

  upload.single('file')(req, res, async (uploadErr) => {
    if (uploadErr) {
      if (uploadErr instanceof multer.MulterError) {
        logger.error(uploadErr);
        return { errorType: 'Other', error: error.internal };
      }
      return { errorType: 'UploadError', message: uploadErr.message };
    }

    if (!req.file.path) { // No Multer error but still no file
      if (typeof inputInfo === 'undefined') {
        return { errorType: 'MissingFields', message: 'Missing required fields: json, file' };
      }
      return { errorType: 'MissingField', message: 'Missing required field: file' };
    }

    const result = await DaInputs.CreateInput(req.body.json, req.file);

    switch (result.errorType) {
      case 'UploadError':
        return res.status(500).json(result);
      case 'MissingFields':
        return res.status(400).json(result);
      case 'MissingField':
        return res.status(400).json(result);
      case 'Other':
        return res.status(500).json(result);
      default:
        return res.status(200).json(result);
    }
  });
});

// Get Input
router.get('/:inputId', async (req, res) => {
  const { inputId } = req.params;
  const token = req.get('Authorization');

  const isAllowed = verify(token);
  if (!isAllowed) {
    return res.status(401).json({ error: 'Invalid login' });
  }

  const result = await DaInputs.GetInputById(inputId);

  switch (result.errorType) {
    case 'Other':
      return res.status(500).json(result);
    default:
      return res.status(200).json(result);
  }
});

// Get All Inputs
router.get('/', async (req, res) => {
  const token = req.get('Authorization');

  const isAllowed = verify(token);
  if (!isAllowed) {
    return res.status(401).json({ error: 'Invalid login' });
  }

  const result = await DaInputs.GetInputs();

  switch (result.errorType) {
    case 'Other':
      return res.status(500).json(result);
    default:
      return res.status(200).json(result);
  }
});

// Delete Input
router.delete('/:inputId', async (req, res) => {
  const { inputId } = req.params;
  const token = req.get('Authorization');

  const isAllowed = verify(token);
  if (!isAllowed) {
    return res.status(401).json({ error: 'Invalid login' });
  }

  const result = await DaInputs.DeleteInput(inputId);

  switch (result.errorType) {
    case 'Other':
      return res.status(500).json(result);
    default:
      return res.status(200).json(result);
  }
});

module.exports = router;
