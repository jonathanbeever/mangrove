const mongoose = require('mongoose');
const Spec = require('./spec');
const { specDefaults } = require('../specDefaults');

module.exports = Spec.discriminator(
  'adiSpec',
  new mongoose.Schema({
    maxFreq: {
      type: Number,
      min: specDefaults.adi.maxFreq.min,
      max: specDefaults.adi.maxFreq.max,
      default: specDefaults.adi.maxFreq.default,
    },
    dbThreshold: {
      type: Number,
      default: specDefaults.adi.dbThreshold.default,
      min: specDefaults.adi.dbThreshold.min,
      max: specDefaults.adi.dbThreshold.max,
    },
    freqStep: {
      type: Number,
      min: specDefaults.adi.freqStep.min,
      default: specDefaults.adi.freqStep.default,
      max: specDefaults.adi.freqStep.max,
    },
    shannon: { type: Boolean, default: specDefaults.adi.shannon.default },
  }),
);
