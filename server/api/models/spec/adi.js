const mongoose = require('mongoose');
const Spec = require('./spec');
const { MAX_NUM_R } = require('./config');
const { specDefaults } = require('../specDefaults');

module.exports = Spec.discriminator(
  'adiSpec',
  new mongoose.Schema({
    maxFreq: {
      type: Number,
      min: 0,
      max: MAX_NUM_R,
      default: specDefaults.adi.maxFreq,
    },
    dbThreshold: {
      type: Number,
      default: specDefaults.adi.dbThreshold,
      min: -MAX_NUM_R,
      max: MAX_NUM_R,
    },
    freqStep: {
      type: Number,
      min: 1,
      default: specDefaults.adi.freqStep,
      max: MAX_NUM_R,
    },
    shannon: { type: Boolean, default: specDefaults.adi.shannon },
  }),
);
