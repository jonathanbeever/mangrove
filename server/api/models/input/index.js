const mongoose = require('mongoose');

const inputSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  path: { type: String, required: true },
  site: { type: String, required: true },
  series: { type: String, required: true },
  recordTimeMs: { type: Number, required: true },
  coords: {
    type: {
      lat: Number,
      long: Number,
    },
    required: true,
  },
});

module.exports = mongoose.model('Input', inputSchema);
