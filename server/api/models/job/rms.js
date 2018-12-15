const mongoose = require('mongoose');
const Job = require('./job');
const Type = require('../type');

module.exports = Job.discriminator(Type.RMS, new mongoose.Schema({
  spec: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'rmsSpec',
    required: true,
  },
  result: {
    type: {
      // TODO: Determine the correct result for RMS jobs
    },
    default: null,
  },
}));
