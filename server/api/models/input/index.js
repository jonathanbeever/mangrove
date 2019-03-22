const mongoose = require('mongoose');

module.exports = mongoose.model('Input', new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  path: { type: String, required: true },
  site: { type: String, required: true },
  series: { type: String, required: true },
  name: { type: String, required: true },
  recordTimeMs: { type: Number, min: 0, required: true },
  durationMs: { type: Number, min: 0, required: true },
  sampleRateHz: { type: Number, min: 0, required: true },
  sizeBytes: { type: Number, min: 0, required: true },
  coords: {
    type: {
      lat: {
        type: Number,
        min: -90,
        max: 90,
        required: true,
      },
      long: {
        type: Number,
        min: -180,
        max: 180,
        required: true,
      },
    },
    required: true,
  },
}));
