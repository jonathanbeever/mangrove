const mongoose = require('mongoose');
const Job = require('./job');
const JobType = require('../jobType');
const Type = require('../type');

module.exports = Job.discriminator(JobType.NDSI, new mongoose.Schema({
  spec: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Type.NDSI,
    required: true,
  },
  result: {
    type: {
      ndsiL: Number,
      ndsiR: Number,
      biophonyL: Number,
      biophonyR: Number,
      anthrophonyL: Number,
      anthrophonyR: Number,
    },
    default: null,
  },
}));
