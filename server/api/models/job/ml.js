const mongoose = require('mongoose');
const Job = require('./job');
const JobType = require('../jobType');
const Type = require('../type');

module.exports = Job.discriminator(JobType.ML, new mongoose.Schema({
  spec: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Type.ML,
    required: true,
  },
  result: {
    type: {
      sounds: Array,
    },
    default: null,
  },
}));
