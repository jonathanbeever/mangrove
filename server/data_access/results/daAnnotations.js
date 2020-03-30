const mongoose = require('mongoose');
const Annotation = require('../../api/models/results/annotations');

// Adds annotation to database
// Assumes annotationInfo has a jobId, annotation string, and data point for UI
const AddAnnotation = async (annotationInfo) => {
  const annotation = new Annotation({
    _id: new mongoose.Types.ObjectId(),
    jobId: annotationInfo.jobId,
    annotation: annotationInfo.annotation,
    dataPoint: annotationInfo.dataPoint,
    graph: annotationInfo.graph,
  });

  const createAnnotaion = await Annotation.create(annotation);

  const finalAnnotation = {
    annotationId: createAnnotaion._id,
    jobId: createAnnotaion.jobId,
    dataPoint: createAnnotaion.dataPoint,
    graph: createAnnotaion.graph,
  };

  return finalAnnotation;
};

// Gets all annotations assigned to a given job
const GetAnnotationsByJob = async (jobId) => {
  const results = await Annotation.find({ jobId }).exec();

  const annotations = {
    count: results.length,
    annotations: results.map(annotation => ({
      annotationId: annotation._id,
      annotation: annotation.annotation,
      annotationGraph: annotation.graph,
      jobId: annotation.jobId,
      dataPoint: annotation.dataPoint,
    })),
  };

  return annotations;
};

// Deletes annotation by Id
const DeleteAnnotation = async id => Annotation.findByIdAndDelete({ _id: id }).exec();

module.exports = { AddAnnotation, GetAnnotationsByJob, DeleteAnnotation };
