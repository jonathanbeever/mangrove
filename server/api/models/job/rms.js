const mongoose = require('mongoose');
const Job = require('./job');
const JobType = require('../jobType');
const Type = require('../type');

module.exports = Job.discriminator(JobType.RMS, new mongoose.Schema({
  spec: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Type.RMS,
    required: true,
  },
  result: {
    type: {
      rmsL: Number,
      rmsR: Number,
    },
    default: null,
  },
}));
