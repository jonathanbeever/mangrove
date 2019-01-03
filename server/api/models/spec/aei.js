const mongoose = require('mongoose');
const Spec = require('./spec');
const { specDefaults } = require('../specDefaults');

module.exports = Spec.discriminator(
  'aeiSpec',
  new mongoose.Schema({
    maxFreq: {
      type: Number,
      min: specDefaults.aei.maxFreq.min,
      max: specDefaults.aei.maxFreq.max,
      default: specDefaults.aei.maxFreq.default,
    },
    dbThreshold: {
      type: Number,
      default: specDefaults.aei.dbThreshold.default,
      min: specDefaults.aei.dbThreshold.min,
      max: specDefaults.aei.dbThreshold.max,
    },
    freqStep: {
      type: Number,
      min: specDefaults.aei.freqStep.min,
      default: specDefaults.aei.freqStep.default,
      max: specDefaults.aei.freqStep.max,
    },
  }),
);
