const mongoose = require('mongoose');
const Spec = require('./spec');
const { MAX_NUM_R } = require('../../../util/rConstants');
const { specDefaults } = require('../specDefaults');

module.exports = Spec.discriminator(
  'aciSpec',
  new mongoose.Schema({
    minFreq: { type: Number, min: 0, default: specDefaults.aci.minFreq },
    maxFreq: {
      type: Number,
      min: 0,
      max: MAX_NUM_R,
      default: specDefaults.aci.maxFreq,
    },
    j: {
      type: Number,
      min: 1,
      default: specDefaults.aci.j,
      max: MAX_NUM_R,
    },
    fftW: {
      type: Number,
      min: 1,
      default: specDefaults.aci.fftW,
      max: MAX_NUM_R,
    },
  }),
);
