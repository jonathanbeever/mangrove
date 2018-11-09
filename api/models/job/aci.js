const mongoose = require('mongoose');
const Job = require('./job');

module.exports = Job.discriminator('aci', new mongoose.Schema({
  jobSpec: {
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
