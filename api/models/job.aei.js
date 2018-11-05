const mongoose = require('mongoose');
const Job = require('./job');

module.exports = Job.discriminator('aei', new mongoose.Schema({
  jobSpec: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'AeiJobSpec',
    required: true,
  },
}));
