const mongoose = require('mongoose');
const Spec = require('./spec');
const { MAX_NUM_R } = require('./config');
const { specDefaults } = require('../specDefaults');

module.exports = Spec.discriminator(
  'biSpec',
  new mongoose.Schema({
    minFreq: {
      type: Number,
      min: 0,
      default: specDefaults.bi.minFreq,
      max: MAX_NUM_R,
    },
    maxFreq: {
      type: Number,
      min: 0,
      default: specDefaults.bi.maxFreq,
      max: MAX_NUM_R,
    },
    fftW: {
      type: Number,
      min: 1,
      default: specDefaults.bi.fftW,
      max: MAX_NUM_R,
    },
  }),
);
