const mongoose = require('mongoose');
const Annotation = require('./annotations');
const AnnotationType = require('../annotationType');

module.exports = Annotation.discriminator(AnnotationType.ACI, new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: 'true',
  },
}));
