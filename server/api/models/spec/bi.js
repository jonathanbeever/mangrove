const mongoose = require('mongoose');
const Spec = require('./spec');
const { MAX_NUM_R } = require('./config');

module.exports = Spec.discriminator(
  'biSpec',
  new mongoose.Schema({
    minFreq: {
      type: Number,
      min: 0,
      default: 0,
      max: MAX_NUM_R,
    },
    maxFreq: {
      type: Number,
      min: 0,
      default: 16000,
      max: MAX_NUM_R,
    },
    fftW: {
      type: Number,
      min: 1,
      default: 10,
      max: MAX_NUM_R,
    },
  }),
);
