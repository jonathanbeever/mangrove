const mongoose = require('mongoose');
const Spec = require('./spec');
const { specDefaults } = require('../specDefaults');

module.exports = Spec.discriminator(
  'aciSpec',
  new mongoose.Schema({
    minFreq: {
      type: Number,
      min: specDefaults.aci.minFreq.min,
      default: specDefaults.aci.minFreq.default,
      max: specDefaults.aci.minFreq.max,
    },
    maxFreq: {
      type: Number,
      min: specDefaults.aci.maxFreq.min,
      max: specDefaults.aci.maxFreq.max,
      default: specDefaults.aci.maxFreq.default,
    },
    j: {
      type: Number,
      min: specDefaults.aci.j.min,
      default: specDefaults.aci.j.default,
      max: specDefaults.aci.j.max,
    },
    fftW: {
      type: Number,
      min: specDefaults.aci.fftW.min,
      default: specDefaults.aci.fftW.default,
      max: specDefaults.aci.fftW.max,
    },
  }),
);
