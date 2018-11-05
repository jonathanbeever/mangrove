const mongoose = require('mongoose');
const Job = require('./job');

module.exports = Job.discriminator('rms', new mongoose.Schema({
  jobSpec: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'RmsJobSpec',
    required: true,
  },
}));
