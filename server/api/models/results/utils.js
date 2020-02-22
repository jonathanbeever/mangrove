const { arrayDiff } = require('../../../util/array');
const Annotation = require('./annotations');

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

module.exports = { ParseAnnotationJson };
