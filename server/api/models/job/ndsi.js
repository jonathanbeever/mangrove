const mongoose = require('mongoose');
const Job = require('./job');
const Type = require('../type');

module.exports = Job.discriminator(Type.NDSI, new mongoose.Schema({
  spec: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ndsiSpec',
    required: true,
  },
  result: {
    type: {
      ndsiL: Number,
      ndsiR: Number,
      biophonyL: Number,
      biophonyR: Number,
      anthrophonyL: Number,
      anthrophonyR: Number,
    },
    default: null,
  },
}));
