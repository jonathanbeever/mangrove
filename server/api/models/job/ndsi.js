const mongoose = require('mongoose');
const Job = require('./job');

module.exports = Job.discriminator('ndsi', new mongoose.Schema({
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
