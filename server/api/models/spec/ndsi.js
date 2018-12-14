const mongoose = require('mongoose');
const Spec = require('./spec');
const { MAX_NUM_R } = require('./config');

module.exports = Spec.discriminator(
  'ndsiSpec',
  new mongoose.Schema({
    fftW: {
      type: Number,
      min: 1,
      default: 10,
      max: MAX_NUM_R,
    },
    anthroMin: {
      type: Number,
      min: 0,
      default: 5001,
      max: MAX_NUM_R,
    },
    anthroMax: {
      type: Number,
      min: 0,
      default: 20000,
      max: MAX_NUM_R,
    },
    bioMin: {
      type: Number,
      min: 0,
      default: 0,
      max: MAX_NUM_R,
    },
    bioMax: {
      type: Number,
      min: 0,
      default: 5000,
      max: MAX_NUM_R,
    },
  }),
);
