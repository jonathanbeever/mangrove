const mongoose = require('mongoose');

const Status = require('../status');

const options = { discriminatorKey: 'type' };

const jobSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  input: { type: mongoose.Schema.Types.ObjectId, required: true }, // TODO: Add ref
  author: { type: String, required: true },
  creationTimeMs: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      Status.WAITING,
      Status.QUEUED,
      Status.PROCESSING,
      Status.FINISHED,
      Status.FAILED,
      Status.CANCELLED,
    ],
    required: true,
  },
}, options);

module.exports = mongoose.model('Job', jobSchema);
