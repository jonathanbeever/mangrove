const AciJob = require('./aci');
const AdiJob = require('./adi');
const AeiJob = require('./aei');
const BiJob = require('./bi');
const NdsiJob = require('./ndsi');
const RmsJob = require('./rms');

const Type = require('../type');

const getJobKeys = (type, finished = true) => {
  let JobModel = null;
  switch (type) {
    case Type.ACI:
      JobModel = AciJob; break;
    case Type.ADI:
      JobModel = AdiJob; break;
    case Type.AEI:
      JobModel = AeiJob; break;
    case Type.BI:
      JobModel = BiJob; break;
    case Type.NDSI:
      JobModel = NdsiJob; break;
    case Type.RMS:
      JobModel = RmsJob; break;
    default:
      return `Error: Invalid \`type\` parameter (${type}).`;
  }

  const keys = Object.keys(JobModel.schema.paths);
  keys[keys.indexOf('_id')] = 'jobId';
  keys.splice(keys.indexOf('__v'), 1);
  if (!finished) keys.splice(keys.indexOf('result'), 1);

  return keys;
};

module.exports = {
  getJobKeys,
};
