const mongoose = require('mongoose');
const Job = require('./job');

module.exports = Job.discriminator('rms', new mongoose.Schema({
  spec: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'rmsSpec',
    required: true,
  },
  // result: {
  //   type: {
  //     // TBD
  //   },
  //   default: null,
  // },
}));
