const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
const config = require('config');

const multer = require('multer');

const logger = require('../../util/logger');

const { arrayDiff } = require('../../util/array');
const { verify, getUser } = require('../../util/verify');
const { generateSpectrograms } = require('../../util/audio_manipulation');

// TODO: Fix upload destination
const upload = multer({ dest: 'temp' });

router.put('/spectrograms', upload.any(), async (req, res) => {
  console.log(req.files);
  generateSpectrograms(req.files);
  res.status(200).json({ hello: 'world' });
});

module.exports = router;
