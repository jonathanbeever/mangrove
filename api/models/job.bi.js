const mongoose = require('mongoose');
const Job = require('./job');

module.exports = Job.discriminator('bi', new mongoose.Schema({
  jobSpec: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'biSpec',
    required: true,
  },
}));
