const mongoose = require('mongoose');
const Spec = require('./spec');
const Type = require('../type');

module.exports = Spec.discriminator(Type.RMS, new mongoose.Schema({
  // N/A
}));
