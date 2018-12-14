const mongoose = require('mongoose');
const Spec = require('./spec');
const { MAX_NUM_R } = require('./config');

module.exports = Spec.discriminator(
  'aeiSpec',
  new mongoose.Schema({
    maxFreq: {
      type: Number,
      min: 0,
      max: MAX_NUM_R,
      default: 16000,
    },
    dbThreshold: {
      type: Number,
      default: 32,
      min: -MAX_NUM_R,
      max: MAX_NUM_R,
    },
    freqStep: {
      type: Number,
      min: 1,
      default: 512,
      max: MAX_NUM_R,
    },
  }),
);
