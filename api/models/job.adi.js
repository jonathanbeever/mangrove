const mongoose = require('mongoose');
const Job = require('./job');

module.exports = Job.discriminator('adi', new mongoose.Schema({
  jobSpec: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'AdiJobSpec',
    required: true,
  },
}));
