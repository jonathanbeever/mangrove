const mongoose = require('mongoose');
const JobSpec = require('./jobSpec');

module.exports = JobSpec.discriminator('adi', new mongoose.Schema({
  maxFreq: {
    type: Number, min: 0, max: 100000, default: 16000,
  },
  dbThreshold: { type: Number, default: 32 },
  freqStep: { type: Number, min: 1, default: 512 },
  shannon: { type: Boolean, deault: true },
}));
