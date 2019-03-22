const mongoose = require('mongoose');

const Status = require('../status');

const options = { discriminatorKey: 'type' };

module.exports = mongoose.model('Job', new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  input: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Input',
    required: true,
  },
  author: { type: String, required: true },
  creationTimeMs: { type: Number, min: 0, required: true },
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
    default: Status.WAITING,
  },
}, options));
