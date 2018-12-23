const AciJob = require('./aci');
const AdiJob = require('./adi');
const AeiJob = require('./aei');
const BiJob = require('./bi');
const NdsiJob = require('./ndsi');
const RmsJob = require('./rms');

const Type = require('../type');

const newJobKeys = ['type', 'inputId', 'specId'];

const getJobModel = (type) => {
  switch (type) {
    case Type.ACI:
      return AciJob;
    case Type.ADI:
      return AdiJob;
    case Type.AEI:
      return AeiJob;
    case Type.BI:
      return BiJob;
    case Type.NDSI:
      return NdsiJob;
    case Type.RMS:
      return RmsJob;
    default:
      return null;
  }
};

const getJobKeys = (type, finished = true) => {
  const JobModel = getJobModel(type);
  if (!JobModel) {
    return `Error: Invalid \`type\` parameter (${type}).`;
  }

  const keys = Object.keys(JobModel.schema.paths);
  keys[keys.indexOf('_id')] = 'jobId';
  keys.splice(keys.indexOf('__v'), 1);
  if (!finished) keys.splice(keys.indexOf('result'), 1);

  return keys;
};

module.exports = {
  newJobKeys,
  getJobModel,
  getJobKeys,
};
