const express = require('express');

const router = express.Router();

const multer = require('multer');

const { generateSpectrograms } = require('../../util/audio_manipulation');

// TODO: Fix upload destination
const upload = multer({ dest: 'temp' });

router.put('/spectrograms', upload.any(), async (req, res) => {
  console.log(req.files);
  generateSpectrograms(req.files);
  res.status(200).json({ hello: 'world' });
});

module.exports = router;
