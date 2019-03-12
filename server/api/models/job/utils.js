const AciJob = require('./aci');
const AdiJob = require('./adi');
const AeiJob = require('./aei');
const BiJob = require('./bi');
const NdsiJob = require('./ndsi');
const RmsJob = require('./rms');
const Job = require('./job');

const Status = require('../status');
const JobType = require('../jobType');
const Type = require('../type');

const typeToJobType = (type) => {
  switch (type) {
    case Type.ACI: return JobType.ACI;
    case Type.ADI: return JobType.ADI;
    case Type.AEI: return JobType.AEI;
    case Type.BI: return JobType.BI;
    case Type.NDSI: return JobType.NDSI;
    case Type.RMS: return JobType.RMS;
    default: throw new Error(`Invalid 'type' parameter: ${type}`);
  }
};

const jobTypeToType = (jobType) => {
  switch (jobType) {
    case JobType.ACI: return Type.ACI;
    case JobType.ADI: return Type.ADI;
    case JobType.AEI: return Type.AEI;
    case JobType.BI: return Type.BI;
    case JobType.NDSI: return Type.NDSI;
    case JobType.RMS: return Type.RMS;
    default: throw new Error(`Invalid 'jobType' parameter: ${jobType}`);
  }
};

const getJobModel = (type) => {
  switch (type) {
    case Type.ACI: return AciJob;
    case Type.ADI: return AdiJob;
    case Type.AEI: return AeiJob;
    case Type.BI: return BiJob;
    case Type.NDSI: return NdsiJob;
    case Type.RMS: return RmsJob;
    default: throw new Error(`Invalid 'type' parameter: ${type}`);
  }
};

const getJobKeys = (type, finished = true) => {
  const JobModel = getJobModel(type);
  if (!JobModel) {
    throw new Error(`Invalid 'type' parameter: ${type}`);
  }

  const keys = Object.keys(JobModel.schema.paths);
  keys[keys.indexOf('_id')] = 'jobId';
  // The following keys are never shown to users
  keys.splice(keys.indexOf('__v'), 1);
  keys.splice(keys.indexOf('type'), 1);

  if (!finished) keys.splice(keys.indexOf('result'), 1);

  return keys;
};

const newJobKeys = () => ['inputId', 'specId'];

const updateJob = (job, update, populate = false) => {
  const JobModel = getJobModel(jobTypeToType(job.type));
  const updatedJob = JobModel.findByIdAndUpdate(
    job._id,
    update,
    { new: true },
  );
  if (populate) {
    updatedJob
      .populate('input')
      .populate('spec');
  }
  return updatedJob.exec();
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
  .catch(() => { throw new Error('Failed to get pending jobs'); });

// FIXME: These are listed in this order because of the R package,
// `soundecology`. If the ordering of the output parameters changes, then this
// should also be updated. Otherwise, do NOT change the order. If you do, the
// results will be stored in the database incorrectly.
const getResultKeys = (type) => {
  switch (type) {
    case Type.ACI:
      return [
        'aciTotAllL',
        'aciTotAllR',
        'aciTotAllByMinL',
        'aciTotAllByMinR',
        'aciFlValsL',
        'aciFlValsR',
        'aciMatrixL',
        'aciMatrixR',
      ];
    case Type.ADI:
      return [
        'adiL',
        'adiR',
        'bandL',
        'bandR',
        'bandRangeL',
        'bandRangeR',
      ];
    case Type.AEI:
      return [
        'aeiL',
        'aeiR',
      ];
    case Type.BI:
      return [
        'areaL',
        'areaR',
      ];
    case Type.NDSI:
      return [
        'ndsiL',
        'ndsiR',
        'biophonyL',
        'anthrophonyL',
        'biophonyR',
        'anthrophonyR',
      ];
    case Type.RMS:
      return [
        // TODO
      ];
    default:
      throw new Error(`Invalid 'type' parameter: ${type}`);
  }
};

module.exports = {
  typeToJobType,
  getJobModel,
  getJobKeys,
  newJobKeys,
  getPendingJobs,
  updateJob,
  getResultKeys,
};
