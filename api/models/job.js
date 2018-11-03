const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  inputId: mongoose.Schema.Types.ObjectId,
  jobSpecId: mongoose.Schema.Types.ObjectId,
  author: String,
  creationTimeMs: Number,
  status: String,
});

module.exports = mongoose.model('Job', jobSchema);
