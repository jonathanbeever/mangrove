const mongoose = require('mongoose');
const Job = require('./job');
const JobType = require('../jobType');
const Type = require('../type');

module.exports = Job.discriminator(JobType.ADI, new mongoose.Schema({
  spec: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Type.ADI,
    required: true,
  },
  result: {
    type: {
      adiL: Number,
      adiR: Number,
      bandL: [Number],
      bandR: [Number],
      bandRangeL: [String],
      bandRangeR: [String],
    },
    default: null,
  },
}));
