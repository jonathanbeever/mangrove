const mongoose = require('mongoose');

const options = { discriminatorKey: 'type' };

const spec = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  creationTimeMs: { type: Number, required: true },
  author: { type: String, required: true },
}, options);

module.exports = mongoose.model('Spec', spec);
