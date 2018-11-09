const mongoose = require('mongoose');

const options = { discriminatorKey: 'type', collection: 'jobSpec' };

const jobSpec = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  creationTimeMs: { type: Number, required: true },
  author: { type: String, required: true },
}, options);

module.exports = mongoose.model('JobSpec', jobSpec);
