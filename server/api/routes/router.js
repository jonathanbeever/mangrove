const express = require('express');

const router = express.Router();

const Job = require('./analysis/jobs.js');
const Spec = require('./analysis/specs.js');
const Input = require('./analysis/inputs.js');
const Annotations = require('./results/annotations.js');
const Audio = require('./results/audio.js');

router.use('/jobs', Job);
router.use('/specs', Spec);
router.use('/inputs', Input);
router.use('/annotations', Annotations);
router.use('/audio', Audio);

module.exports = router;
