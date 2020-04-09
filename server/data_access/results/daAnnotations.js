const mongoose = require('mongoose');

const { Annotation } = require('../../api/models/results');
const { Job } = require('../../api/models/job');

const { getAnnotationModel, getParamsFromAnnotation } = require('../../api/models/results/utils');

// Adds annotation to database
// Assumes annotationInfo has a jobId, annotation string, and data point for UI
const AddAnnotation = async (annotationInfo) => {
  const AnnotationModel = getAnnotationModel(annotationInfo.type);

  let params = getParamsFromAnnotation(annotationInfo);
  params.jobId = params.jobId.split(',');

  let annotation = new AnnotationModel({
    _id: new mongoose.Types.ObjectId(),
    ...params,
  });

  // TODO: Add actual error response to API route
  // const validationErr = annotation.validateSync();
  // if (validationErr) {
  //   return {
  //     message: Object.values(validationErr.errors).map(e => e.message).join(' '),
  //   };
  // }

  const createAnnotaion = await AnnotationModel.create(annotation);
  console.log(createAnnotaion);

  const finalAnnotation = {
    annotationId: createAnnotaion._id,
    jobId: createAnnotaion.jobId,
    dataPoint: createAnnotaion.dataPoint,
    graph: createAnnotaion.graph,
    type: createAnnotaion.type,
  };

  return finalAnnotation;
};

// Gets all annotations assigned to a given job
const GetAnnotationsByJob = async (jobId) => {
  const job = await Job.findById(jobId).exec();
  const annotationType = `${job.type.slice(0, -3)}Annotation`;
  const AnnotationModel = getAnnotationModel(annotationType);

  const results = await AnnotationModel.find({ jobId }).exec();

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
