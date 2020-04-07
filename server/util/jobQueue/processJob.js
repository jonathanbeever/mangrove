const config = require('config');

const { getJobModel } = require('../../api/models/job/utils');
const Input = require('../../api/models/input');
const { getSpecModel } = require('../../api/models/spec/utils');
const { mockProcessJob } = require('../../test/mock/mockProcessJob');
const RJobProcessor = require('../../util/jobProcessor');
const MLJobProcessor = require('../jobProcessor/ML/mlJobProcessor');
const JobTypes = require('../../api/models/jobType');

// Sets job processor to separate value if job is machine learning
// Uses switch case to easily include other job processors for future analysis types
// Or R script modularization
const setJobProcessor = (jobType) => {
  switch (jobType) {
    case JobTypes.ML:
      return MLJobProcessor;

    case JobTypes.ACI:
    case JobTypes.ADI:
    case JobTypes.AEI:
    case JobTypes.BI:
    case JobTypes.NDSI:
    case JobTypes.RMS:
    default:
      return RJobProcessor.process;
  }
};

// Export the job main job processor function as an 'entry point' to analysis
module.exports = async (job) => {
  const JobModel = getJobModel(job.data.spec.type);
  const SpecModel = getSpecModel(job.data.spec.type);
  const populatedJob = JobModel(job.data);
  populatedJob.input = Input(job.data.input);
  populatedJob.spec = SpecModel(job.data.spec);
  console.log(job.data.type);
  let jobProcess;
  config.util.getEnv('NODE_ENV') !== 'test'
    ? jobProcess = setJobProcessor(job.data.type)
    : jobProcess = mockProcessJob;

  const result = await jobProcess(populatedJob);
  return result;
};
