const mongoose = require('mongoose');
const Spec = require('./spec');
const Type = require('../type');
// const Param = require('./param');

module.exports = Spec.discriminator(Type.RMS, new mongoose.Schema({
  // TODO
}));
