const mongoose = require('mongoose');
const Spec = require('./spec');
const Type = require('../type');
const Param = require('./param');

module.exports = Spec.discriminator(Type.AEI, new mongoose.Schema({
  maxFreq: {
    type: Number,
    min: Param.aei.maxFreq.min,
    max: Param.aei.maxFreq.max,
    default: Param.aei.maxFreq.default,
  },
  dbThreshold: {
    type: Number,
    default: Param.aei.dbThreshold.default,
    min: Param.aei.dbThreshold.min,
    max: Param.aei.dbThreshold.max,
  },
  freqStep: {
    type: Number,
    min: Param.aei.freqStep.min,
    default: Param.aei.freqStep.default,
    max: Param.aei.freqStep.max,
  },
}));
