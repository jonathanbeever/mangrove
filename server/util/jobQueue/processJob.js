const config = require('config');

const { getJobModel } = require('../../api/models/job/utils');
const Input = require('../../api/models/input');
const { getSpecModel } = require('../../api/models/spec/utils');
const { mockProcessJob } = require('../../test/mock/mockProcessJob');
const jobProcessor = require('../../util/jobProcessor');

module.exports = async (job) => {
  const JobModel = getJobModel(job.data.spec.type);
  const SpecModel = getSpecModel(job.data.spec.type);
  const populatedJob = JobModel(job.data);
  populatedJob.input = Input(job.data.input);
  populatedJob.spec = SpecModel(job.data.spec);

  let jobProcess;
  config.util.getEnv('NODE_ENV') !== 'test'
    ? jobProcess = jobProcessor.process
    : jobProcess = mockProcessJob;

  const result = await jobProcess(populatedJob);
  return result;
};
