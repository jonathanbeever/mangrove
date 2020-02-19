const express = require('express');

const router = express.Router();

const Job = require('./analysis/jobs.js');
const Spec = require('./analysis/specs.js');
const Input = require('./analysis/inputs.js');
const MachineListen = require('./analysis/ml.js');
const Annotations = require('./results/annotations.js');

router.use('/jobs', Job);
router.use('/specs', Spec);
router.use('/inputs', Input);
router.use('/ml', MachineListen);
router.use('/annotations', Annotations);

module.exports = router;
