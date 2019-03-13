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
      // TODO: Determine the correct result for RMS jobs
    },
    default: null,
  },
}));
