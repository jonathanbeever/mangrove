const express = require('express');

const router = express.Router();

const Job = require('./jobs.js');
const Spec = require('./specs.js');
const Input = require('./inputs.js');
const MachineListen = require('./ml.js');

router.use('/jobs', Job);
router.use('/specs', Spec);
router.use('/inputs', Input);
router.use('/ml', MachineListen);

module.exports = router;
