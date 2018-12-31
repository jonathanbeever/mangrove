const mongoose = require('mongoose');
const Spec = require('./spec');
const { specDefaults } = require('../specDefaults');
const { MAX_NUM_R } = require('./config');

module.exports = Spec.discriminator(
  'ndsiSpec',
  new mongoose.Schema({
    fftW: {
      type: Number,
      min: 1,
      default: specDefaults.ndsi.fftW,
      max: MAX_NUM_R,
    },
    anthroMin: {
      type: Number,
      min: 0,
      default: specDefaults.ndsi.anthroMin,
      max: MAX_NUM_R,
    },
    anthroMax: {
      type: Number,
      min: 0,
      default: specDefaults.ndsi.anthroMax,
      max: MAX_NUM_R,
    },
    bioMin: {
      type: Number,
      min: 0,
      default: specDefaults.ndsi.bioMin,
      max: MAX_NUM_R,
    },
    bioMax: {
      type: Number,
      min: 0,
      default: specDefaults.ndsi.bioMax,
      max: MAX_NUM_R,
    },
  }),
);
