const express = require('express');

const router = express.Router();

const multer = require('multer');

const { generateSpectrograms } = require('../../util/audio_manipulation');
const { runPredictions } = require('../../util/ai/runPredictions');

// TODO: Fix upload destination
const upload = multer({ dest: 'temp' });

router.get('/', async (req, res) => {
  res.status(200).json({ hello: 'world' });
});

router.put('/spectrograms', upload.any(), async (req, res) => {
  console.log(req.files);
  console.log(generateSpectrograms(req.files));
  res.status(200).json({ hello: 'world' });
});

router.put('/mlJob', upload.any(), async (req, res) => {
  const spectrograms = await generateSpectrograms(req.files).then(value => value);
  console.log(`spectrograms: ${spectrograms}`);

  const predictions = runPredictions(spectrograms);

  res.status(200).json(predictions);

  // res.status(200).json({ predictions });
});

module.exports = router;
