const mongoose = require('mongoose');
const Spec = require('./spec');
const Type = require('../type');
const Param = require('./param');

module.exports = Spec.discriminator(Type.ACI, new mongoose.Schema({
  minFreq: {
    type: Number,
    min: Param.aci.minFreq.min,
    default: Param.aci.minFreq.default,
    max: Param.aci.minFreq.max,
  },
  maxFreq: {
    type: Number,
    min: Param.aci.maxFreq.min,
    max: Param.aci.maxFreq.max,
    default: Param.aci.maxFreq.default,
  },
  j: {
    type: Number,
    min: Param.aci.j.min,
    default: Param.aci.j.default,
    max: Param.aci.j.max,
  },
  fftW: {
    type: Number,
    min: Param.aci.fftW.min,
    default: Param.aci.fftW.default,
    max: Param.aci.fftW.max,
  },
}));
