const AciJob = require('./aci');
const AdiJob = require('./adi');
const AeiJob = require('./aei');
const BiJob = require('./bi');
const NdsiJob = require('./ndsi');
const RmsJob = require('./rms');
const Job = require('./job');

const Status = require('../status');

const Type = require('../type');

const getJobModel = (type) => {
  switch (type) {
    case Type.ACI: return AciJob;
    case Type.ADI: return AdiJob;
    case Type.AEI: return AeiJob;
    case Type.BI: return BiJob;
    case Type.NDSI: return NdsiJob;
    case Type.RMS: return RmsJob;
    default: return null;
  }
};


const getJobKeys = (type, finished = true) => {
  const JobModel = getJobModel(type);
  if (!JobModel) {
    throw new Error(`Error: Invalid 'type' parameter (${type}).`);
  }

  const keys = Object.keys(JobModel.schema.paths);
  keys[keys.indexOf('_id')] = 'jobId';
  keys.splice(keys.indexOf('__v'), 1);
  if (!finished) keys.splice(keys.indexOf('result'), 1);

  return keys;
};

const newJobKeys = () => ['type', 'inputId', 'specId'];

const updateJob = (job, update) => {
  const newJob = { ...job._doc, ...update };
  const JobModel = getJobModel(newJob.type);
  return JobModel.findByIdAndUpdate(
    newJob._id,
    newJob,
    { new: true },
  )
    .then(updatedJob => updatedJob)
    .catch(() => {
      throw new Error(`Failed to update job ${job._id}`);
    });
};

const sortByStatusByTime = (jobs) => {
  const statusPriority = Object.values(Status);

  jobs.sort((firstJob, secondJob) => {
    if (firstJob.status === secondJob.status) {
      return firstJob.creationTimeMs - secondJob.creationTimeMs;
    }
    return statusPriority.indexOf(secondJob.status)
      - statusPriority.indexOf(firstJob.status);
  });
  return jobs;
};

const getPendingJobs = () => Job
  .find({ status: { $in: [Status.QUEUED, Status.PROCESSING, Status.WAITING] } })
  .then(waitingJobs => sortByStatusByTime(waitingJobs))
  .catch(() => new Error('Failed to get pending jobs'));

module.exports = {
  getJobModel,
  getJobKeys,
  newJobKeys,
  getPendingJobs,
  updateJob,
};
