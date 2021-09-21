const mongoose = require('mongoose');
const Spec = require('./spec');
const Type = require('../type');

module.exports = Spec.discriminator(Type.ML, new mongoose.Schema({
  // N/A
}));
