const mongoose = require('mongoose');
const Spec = require('./spec');

module.exports = Spec.discriminator(
  'rmsSpec',
  new mongoose.Schema({
    // TODO
  }),
);
