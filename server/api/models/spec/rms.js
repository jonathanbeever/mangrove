const mongoose = require('mongoose');
const Spec = require('./spec');
// const { specDefaults } = require('../specDefaults');

module.exports = Spec.discriminator(
  'rmsSpec',
  new mongoose.Schema({
    // TODO
  }),
);
