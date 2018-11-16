const mongoose = require('mongoose');
const Job = require('./job');

module.exports = Job.discriminator('adi', new mongoose.Schema({
  jobSpec: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'adiSpec',
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
