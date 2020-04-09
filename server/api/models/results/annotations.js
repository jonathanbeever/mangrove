const mongoose = require('mongoose');

const options = { discriminatorKey: 'type' };

module.exports = mongoose.model('Annotation', new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  annotation: String,
  graph: String,

  // Using mixed SchemaType requires that whenever a document's dataPoint changes,
  // it must use the 'markModified' function directly after
  // After we determine how to represent the dataPoint, this can change to an object
  dataPoint: mongoose.Schema.Types.Mixed,
}, options));
