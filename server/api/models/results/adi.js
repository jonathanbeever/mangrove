const mongoose = require('mongoose');
const Annotation = require('./annotations');
const AnnotationType = require('../annotationType');

module.exports = Annotation.discriminator(AnnotationType.ADI, new mongoose.Schema({
  // Use an array of job ids because ADI annotations are for averages of several files
  // We should only return an annotation if the exact same jobs (and no more)
  // are used to generate the visualization
  jobId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: 'true' }],
}));
