const mongoose = require('mongoose');
const Job = require('./job');

module.exports = Job.discriminator('aei', new mongoose.Schema({
  jobSpec: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'aeiSpec',
    required: true,
  },
  result: {
    type: {
      aeiL: Number,
      aeiR: Number,
    },
    default: null,
  },
}));
