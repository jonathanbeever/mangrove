const mongoose = require('mongoose');
const Job = require('./job');
const JobType = require('../jobType');
const Type = require('../type');

module.exports = Job.discriminator(JobType.BI, new mongoose.Schema({
  spec: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Type.BI,
    required: true,
  },
  result: {
    type: {
      areaL: Number,
      areaR: Number,
    },
    default: null,
  },
}));
