const mongoose = require('mongoose');
const Job = require('./job');
const JobType = require('../jobType');
const Type = require('../type');
const SoundType = require('./results/sounds');

module.exports = Job.discriminator(JobType.ML, new mongoose.Schema({
  spec: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Type.ML,
    required: true,
  },

  result: {
    type: {
      // Sound Type enums for the ML model to return
      // Must include all possible classes
      sound: {
        type: String,
        enum: [
          // TODO: Add actual classes -> Plane / Train used as examples
          SoundType.Background,
          SoundType.Train,
        ],
      },

      // Number representing model's confidence in the sound type identified
      confidence: Number,
      startTime: Number,
      duration: Number,
    },
    default: null,
  },
}));
