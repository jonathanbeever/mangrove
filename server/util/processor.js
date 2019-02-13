const config = require('config');
const { getJobModel } = require('../api/models/job/utils');
const Input = require('../api/models/input');
const { getSpecModel } = require('../api/models/spec/utils');
const { mockProcessJob } = require('../test/mock/mockProcessJob');
const jobProcessor = require('../util/jobProcessor');

module.exports = async (job) => {
  // TODO: populate correctly from outside(create random jobs with specs).
  let result;
  let jobProcess;
  if (config.util.getEnv('NODE_ENV') !== 'test') {
    const JobModel = getJobModel(job.data.type);
    const SpecModel = getSpecModel(job.data.spec.type);
    const populatedJob = JobModel(job.data);
    populatedJob.input = Input(job.data.input);
    populatedJob.spec = SpecModel(job.data.spec);
    jobProcess = jobProcessor.process;
    result = await jobProcess(populatedJob);
  } else {
    jobProcess = mockProcessJob;
    result = await jobProcess(job);
  }
  return Promise.resolve(result);
};
