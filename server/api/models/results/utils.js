const AciAnnotation = require('./aci');
const AdiAnnotation = require('./adi');
const AeiAnnotation = require('./aei');
const MlAnnotation = require('./ml');
const NdsiAnnotation = require('./ndsi');
const BiAnnotation = require('./bi');
const Annotation = require('./annotations');

const { arrayDiff } = require('../../../util/array');

const AnnotationType = require('../annotationType');

const getAnnotationModel = (type) => {
  switch (type) {
    case AnnotationType.ACI: return AciAnnotation;
    case AnnotationType.ADI: return AdiAnnotation;
    case AnnotationType.AEI: return AeiAnnotation;
    case AnnotationType.BI: return BiAnnotation;
    case AnnotationType.NDSI: return NdsiAnnotation;
    case AnnotationType.ML: return MlAnnotation;
    default: throw new Error(`Invalid \`type\` parameter (${type}).`);
  }
};

const getParamsFromAnnotation = (annotation) => {
  switch (annotation.type) {
    case AnnotationType.ACI:
      return {
        ...(typeof annotation.jobId !== 'undefined' && { jobId: annotation.jobId }),
        ...(typeof annotation.annotation !== 'undefined' && { annotation: annotation.annotation }),
        ...(typeof annotation.graph !== 'undefined' && { graph: annotation.graph }),
        ...(typeof annotation.dataPoint !== 'undefined' && { dataPoint: annotation.dataPoint }),
      };
    case AnnotationType.ADI:
      return {
        ...(typeof annotation.jobId !== 'undefined' && { jobId: annotation.jobId }),
        ...(typeof annotation.annotation !== 'undefined' && { annotation: annotation.annotation }),
        ...(typeof annotation.graph !== 'undefined' && { graph: annotation.graph }),
        ...(typeof annotation.dataPoint !== 'undefined' && { dataPoint: annotation.dataPoint }),
      };
    case AnnotationType.AEI:
      return {
        ...(typeof annotation.jobId !== 'undefined' && { jobId: annotation.jobId }),
        ...(typeof annotation.annotation !== 'undefined' && { annotation: annotation.annotation }),
        ...(typeof annotation.graph !== 'undefined' && { graph: annotation.graph }),
        ...(typeof annotation.dataPoint !== 'undefined' && { dataPoint: annotation.dataPoint }),
      };
    case AnnotationType.NDSI:
      return {
        ...(typeof annotation.jobId !== 'undefined' && { jobId: annotation.jobId }),
        ...(typeof annotation.annotation !== 'undefined' && { annotation: annotation.annotation }),
        ...(typeof annotation.graph !== 'undefined' && { graph: annotation.graph }),
        ...(typeof annotation.dataPoint !== 'undefined' && { dataPoint: annotation.dataPoint }),
      };
    case AnnotationType.BI:
      return {
        ...(typeof annotation.jobId !== 'undefined' && { jobId: annotation.jobId }),
        ...(typeof annotation.annotation !== 'undefined' && { annotation: annotation.annotation }),
        ...(typeof annotation.graph !== 'undefined' && { graph: annotation.graph }),
        ...(typeof annotation.dataPoint !== 'undefined' && { dataPoint: annotation.dataPoint }),
      };
    case AnnotationType.ML:
      return {
        ...(typeof annotation.jobId !== 'undefined' && { jobId: annotation.jobId }),
        ...(typeof annotation.annotation !== 'undefined' && { annotation: annotation.annotation }),
        ...(typeof annotation.graph !== 'undefined' && { graph: annotation.graph }),
        ...(typeof annotation.dataPoint !== 'undefined' && { dataPoint: annotation.dataPoint }),
      };
    default: throw new Error(`Invalid \`type\` parameter (${annotation.type}).`);
  }
};

const dataPointKeys = () => ['X', 'Y'];

const getAnnotationKeys = () => {
  const keys = Object.keys(Annotation.schema.paths);
  keys[keys.indexOf('_id')] = 'annotationId';
  // The following keys are never shown to users
  keys.splice(keys.indexOf('__v'), 1);
  keys.splice(keys.indexOf('path'), 1);

  return keys;
};

const newAnnotationKeys = () => {
  const keys = getAnnotationKeys();
  return keys;
};

const ParseAnnotationJson = (json) => {
  let annotation = null;
  try {
    annotation = JSON.parse(json);
  } catch (err) {
    throw new Error('Invalid JSON.');
  }

  let { dataPoint } = annotation;
  if (!dataPoint || typeof dataPoint !== 'object') dataPoint = {};

  const missingKeys = arrayDiff(newAnnotationKeys(), Object.keys(annotation))
    .concat(
      arrayDiff(dataPointKeys(), Object.keys(dataPoint) || [])
        .map(key => `dataPoint.${key}`),
    );
  if (missingKeys.length > 0) {
    throw new Error(`JSON missing required keys: ${missingKeys.join(', ')}.`);
  }

  const extraKeys = arrayDiff(Object.keys(annotation), newAnnotationKeys())
    .concat(
      arrayDiff(Object.keys(dataPoint) || [], dataPointKeys())
        .map(key => `dataPoint.${key}`),
    );
  if (extraKeys.length > 0) {
    throw new Error(`JSON contains invalid keys: ${extraKeys.join(', ')}.`);
  }

  return annotation;
};

module.exports = { ParseAnnotationJson, getAnnotationModel, getParamsFromAnnotation };
