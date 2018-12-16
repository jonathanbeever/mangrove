const mongoose = require('mongoose');
const Job = require('./job');
const Type = require('../type');

module.exports = Job.discriminator(Type.ADI, new mongoose.Schema({
  spec: {
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
