const mongoose = require('mongoose');
const Job = require('./job');

module.exports = Job.discriminator('aei', new mongoose.Schema({
  spec: {
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
