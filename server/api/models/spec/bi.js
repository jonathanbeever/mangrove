const mongoose = require('mongoose');
const Spec = require('./spec');
const Param = require('./param');

module.exports = Spec.discriminator(
  'biSpec',
  new mongoose.Schema({
    minFreq: {
      type: Number,
      min: Param.bi.minFreq.min,
      default: Param.bi.minFreq.default,
      max: Param.bi.minFreq.max,
    },
    maxFreq: {
      type: Number,
      min: Param.bi.maxFreq.min,
      default: Param.bi.maxFreq.default,
      max: Param.bi.maxFreq.max,
    },
    fftW: {
      type: Number,
      min: Param.bi.fftW.min,
      default: Param.bi.fftW.default,
      max: Param.bi.fftW.max,
    },
  }),
);
