const mongoose = require('mongoose');
const Job = require('./job');

module.exports = Job.discriminator('ndsi', new mongoose.Schema({
  jobSpec: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'NdsiJobSpec',
    required: true,
  },
}));
