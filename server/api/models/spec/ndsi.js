const mongoose = require('mongoose');
const Spec = require('./spec');
const Type = require('../type');
const Param = require('./param');

module.exports = Spec.discriminator(Type.NDSI, new mongoose.Schema({
  fftW: {
    type: Number,
    min: Param.ndsi.fftW.min,
    default: Param.ndsi.fftW.default,
    max: Param.ndsi.fftW.max,
  },
  anthroMin: {
    type: Number,
    min: Param.ndsi.anthroMin.min,
    default: Param.ndsi.anthroMin.default,
    max: Param.ndsi.anthroMin.max,
  },
  anthroMax: {
    type: Number,
    min: Param.ndsi.anthroMax.min,
    default: Param.ndsi.anthroMax.default,
    max: Param.ndsi.anthroMax.max,
  },
  bioMin: {
    type: Number,
    min: Param.ndsi.bioMin.min,
    default: Param.ndsi.bioMin.default,
    max: Param.ndsi.bioMin.max,
  },
  bioMax: {
    type: Number,
    min: Param.ndsi.bioMax.min,
    default: Param.ndsi.bioMax.default,
    max: Param.ndsi.bioMax.max,
  },
}));
