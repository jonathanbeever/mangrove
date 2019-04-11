const mongoose = require('mongoose');
const Job = require('./job');
const JobType = require('../jobType');
const Type = require('../type');

module.exports = Job.discriminator(JobType.ACI, new mongoose.Schema({
  spec: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Type.ACI,
    required: true,
  },
  result: {
    type: {
      aciTotAllL: Number,
      aciTotAllR: Number,
      aciTotAllByMinL: Number,
      aciTotAllByMinR: Number,
      aciOverTimeL: [Number],
      aciOverTimeR: [Number],
      aciFlValsL: [Number],
      aciFlValsR: [Number],
    },
    default: null,
  },
}));
