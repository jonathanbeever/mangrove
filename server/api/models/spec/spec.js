const mongoose = require('mongoose');

const options = { discriminatorKey: 'type' };

module.exports = mongoose.model('Spec', new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
}, options));
