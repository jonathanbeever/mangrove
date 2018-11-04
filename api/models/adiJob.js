const mongoose = require('mongoose');

const adiJobSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: { type: String, required: true },
  input: { type: mongoose.Schema.Types.ObjectId, required: true },
  jobSpec: { type: mongoose.Schema.Types.ObjectId, required: true },
  author: { type: String, required: true },
  creationTimeMs: { type: Number, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model('AdiJob', adiJobSchema);
