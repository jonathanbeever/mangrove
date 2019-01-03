const mongoose = require('mongoose');
const Spec = require('./spec');
const { specDefaults } = require('../specDefaults');

module.exports = Spec.discriminator(
  'ndsiSpec',
  new mongoose.Schema({
    fftW: {
      type: Number,
      min: specDefaults.ndsi.fftW.min,
      default: specDefaults.ndsi.fftW.default,
      max: specDefaults.ndsi.fftW.max,
    },
    anthroMin: {
      type: Number,
      min: specDefaults.ndsi.anthroMin.min,
      default: specDefaults.ndsi.anthroMin.default,
      max: specDefaults.ndsi.anthroMin.max,
    },
    anthroMax: {
      type: Number,
      min: specDefaults.ndsi.anthroMax.min,
      default: specDefaults.ndsi.anthroMax.default,
      max: specDefaults.ndsi.anthroMax.max,
    },
    bioMin: {
      type: Number,
      min: specDefaults.ndsi.bioMin.min,
      default: specDefaults.ndsi.bioMin.default,
      max: specDefaults.ndsi.bioMin.max,
    },
    bioMax: {
      type: Number,
      min: specDefaults.ndsi.bioMax.min,
      default: specDefaults.ndsi.bioMax.default,
      max: specDefaults.ndsi.bioMax.max,
    },
  }),
);
