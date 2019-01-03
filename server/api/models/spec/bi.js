const mongoose = require('mongoose');
const Spec = require('./spec');
const { specDefaults } = require('../specDefaults');

module.exports = Spec.discriminator(
  'biSpec',
  new mongoose.Schema({
    minFreq: {
      type: Number,
      min: specDefaults.bi.minFreq.min,
      default: specDefaults.bi.minFreq.default,
      max: specDefaults.bi.minFreq.max,
    },
    maxFreq: {
      type: Number,
      min: specDefaults.bi.maxFreq.min,
      default: specDefaults.bi.maxFreq.default,
      max: specDefaults.bi.maxFreq.max,
    },
    fftW: {
      type: Number,
      min: specDefaults.bi.fftW.min,
      default: specDefaults.bi.fftW.default,
      max: specDefaults.bi.fftW.max,
    },
  }),
);
