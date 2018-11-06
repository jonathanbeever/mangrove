const mongoose = require('mongoose');
const JobSpec = require('./jobSpec');

module.exports = JobSpec.discriminator('ndsi', new mongoose.Schema({
  fftW: { Type: Number, min: 1, default: 10 },
  anthroMin: { Type: Number, min: 0, default: 5001 },
  anthroMax: { Type: Number, min: 0, default: 20000 },
  bioMin: { Type: Number, min: 0, default: 0 },
  bioMax: { Type: Number, min: 0, default: 5000 },
}));
