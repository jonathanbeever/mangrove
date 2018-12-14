const mongoose = require('mongoose');
const { Spec } = require('./spec');

module.exports = Spec.discriminator(
  'adiSpec',
  new mongoose.Schema({
    maxFreq: {
      type: Number,
      min: 0,
      max: 2147483647,
      default: 16000,
    },
    dbThreshold: {
      type: Number,
      default: 32,
      min: -2147483647,
      max: 2147483647,
    },
    freqStep: {
      type: Number,
      min: 1,
      default: 512,
      max: 2147483647,
    },
    shannon: { type: Boolean, default: true },
  }),
);
