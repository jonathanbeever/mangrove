const mongoose = require('mongoose');
const Job = require('./job');
const JobType = require('../jobType');
const Type = require('../type');

module.exports = Job.discriminator(JobType.AEI, new mongoose.Schema({
  spec: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Type.AEI,
    required: true,
  },
  result: {
    type: {
      aeiL: Number,
      aeiR: Number,
      bandL: [Number],
      bandR: [Number],
      bandRangeL: [String],
      bandRangeR: [String],
    },
    default: null,
  },
}));
