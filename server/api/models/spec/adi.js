const mongoose = require('mongoose');
const Spec = require('./spec');
const Param = require('./param');

module.exports = Spec.discriminator(
  'adiSpec',
  new mongoose.Schema({
    maxFreq: {
      type: Number,
      min: Param.adi.maxFreq.min,
      max: Param.adi.maxFreq.max,
      default: Param.adi.maxFreq.default,
    },
    dbThreshold: {
      type: Number,
      default: Param.adi.dbThreshold.default,
      min: Param.adi.dbThreshold.min,
      max: Param.adi.dbThreshold.max,
    },
    freqStep: {
      type: Number,
      min: Param.adi.freqStep.min,
      default: Param.adi.freqStep.default,
      max: Param.adi.freqStep.max,
    },
    shannon: { type: Boolean, default: Param.adi.shannon.default },
  }),
);
