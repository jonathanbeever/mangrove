const mongoose = require('mongoose');
const Job = require('./job');
const Type = require('../type');

module.exports = Job.discriminator(Type.AEI, new mongoose.Schema({
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
