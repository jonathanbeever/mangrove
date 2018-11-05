const mongoose = require('mongoose');

const options = { discriminatorKey: 'type' };

const jobSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  input: { type: mongoose.Schema.Types.ObjectId, required: true },
  author: { type: String, required: true },
  creationTimeMs: { type: Number, required: true },
  status: { type: String, required: true },
}, options);

module.exports = mongoose.model('Job', jobSchema);
