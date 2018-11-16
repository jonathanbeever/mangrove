const mongoose = require('mongoose');
const Spec = require('./spec');

module.exports = Spec.discriminator('biSpec', new mongoose.Schema({
  minFreq: { type: Number, min: 0, default: 0 },
  maxFreq: { type: Number, min: 0, default: 16000 },
  fftW: { type: Number, min: 1, default: 10 },
}));
