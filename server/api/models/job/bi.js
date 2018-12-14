const mongoose = require('mongoose');
const Job = require('./job');

module.exports = Job.discriminator('bi', new mongoose.Schema({
  spec: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'biSpec',
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
