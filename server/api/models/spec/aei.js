const mongoose = require('mongoose');
const Spec = require('./spec');
const { MAX_NUM_R } = require('../../../util/rConstants');
const { specDefaults } = require('../specDefaults');

module.exports = Spec.discriminator(
  'aeiSpec',
  new mongoose.Schema({
    maxFreq: {
      type: Number,
      min: 0,
      max: MAX_NUM_R,
      default: specDefaults.aei.maxFreq,
    },
    dbThreshold: {
      type: Number,
      default: specDefaults.aei.dbThreshold,
      min: -MAX_NUM_R,
      max: MAX_NUM_R,
    },
    freqStep: {
      type: Number,
      min: 1,
      default: specDefaults.aei.freqStep,
      max: MAX_NUM_R,
    },
  }),
);
