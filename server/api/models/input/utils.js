const nodePath = require('path');

const { arrayDiff } = require('../../../util/array');

const Input = require('./index');

const getInputKeys = () => {
  const keys = Object.keys(Input.schema.paths);
  keys[keys.indexOf('_id')] = 'inputId';
  // The following keys are never shown to users
  keys.splice(keys.indexOf('__v'), 1);
  keys.splice(keys.indexOf('path'), 1);

  return keys;
};

const newInputKeys = (includeOptional = false) => {
  const keys = getInputKeys();
  if (!includeOptional) {
    keys.splice(keys.indexOf('name'), 1);
  }
  // The following keys are instantiated upon upload, not provided by the user
  keys.splice(keys.indexOf('inputId'), 1);
  keys.splice(keys.indexOf('durationMs'), 1);
  keys.splice(keys.indexOf('sampleRateHz'), 1);
  keys.splice(keys.indexOf('sizeBytes'), 1);

  return keys;
};

const coordsKeys = () => ['lat', 'long'];

const parseInputJson = (json) => {
  let input = null;
  try {
    input = JSON.parse(json);
  } catch (err) {
    throw new Error('Invalid JSON.');
  }

  let { coords } = input;
  if (!coords || typeof coords !== 'object') coords = {};

  const missingKeys = arrayDiff(newInputKeys(), Object.keys(input))
    .concat(
      arrayDiff(coordsKeys(), Object.keys(coords) || [])
        .map(key => `coords.${key}`),
    );
  if (missingKeys.length > 0) {
    throw new Error(`JSON missing required keys: ${missingKeys.join(', ')}.`);
  }

  const extraKeys = arrayDiff(Object.keys(input), newInputKeys(true))
    .concat(
      arrayDiff(Object.keys(coords) || [], coordsKeys())
        .map(key => `coords.${key}`),
    );
  if (extraKeys.length > 0) {
    throw new Error(`JSON contains invalid keys: ${extraKeys.join(', ')}.`);
  }

  return input;
};

const getExtensionFromMimetype = (mimetype) => {
  switch (mimetype) {
    case 'audio/wave':
      return 'wav';
    case 'audio/wav':
      return 'wav';
    default:
      throw new Error(`Invalid mimetype: ${mimetype}`);
  }
};

const getNewFilename = (recordTimeMs, mimetype) => `${recordTimeMs}.${getExtensionFromMimetype(mimetype)}`;

const getExtensionlessFilename = path => nodePath.parse(path).name;

module.exports = {
  getInputKeys,
  newInputKeys,
  coordsKeys,
  parseInputJson,
  getExtensionFromMimetype,
  getNewFilename,
  getExtensionlessFilename,
};
