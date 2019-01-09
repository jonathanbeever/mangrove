const mongoose = require('mongoose');
const Spec = require('./spec');
// const Param = require('./param');

module.exports = Spec.discriminator(
  'rmsSpec',
  new mongoose.Schema({
    // TODO
  }),
);
