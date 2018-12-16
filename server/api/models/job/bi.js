const mongoose = require('mongoose');
const Job = require('./job');
const Type = require('../type');

module.exports = Job.discriminator(Type.BI, new mongoose.Schema({
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
