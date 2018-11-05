const mongoose = require('mongoose');
const Job = require('./job');

module.exports = Job.discriminator('aci', new mongoose.Schema({
  jobSpec: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'AciJobSpec',
    required: true,
  },
}));
