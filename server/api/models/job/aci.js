const mongoose = require('mongoose');
const Job = require('./job');
const Type = require('../type');

module.exports = Job.discriminator(Type.ACI, new mongoose.Schema({
  spec: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'aciSpec',
    required: true,
  },
  result: {
    type: {
      aciTotAllL: Number,
      aciTotAllR: Number,
      aciTotAllByMinL: Number,
      aciTotAllByMinR: Number,
      aciFlValsL: [Number],
      aciFlValsR: [Number],
      aciMatrixL: [[Number]],
      aciMatrixR: [[Number]],
    },
    default: null,
  },
}));
