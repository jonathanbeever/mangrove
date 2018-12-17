const { nextMockObjectId } = require('./mockObjectId');

const { getJobModel } = require('../../api/models/job/utils');
const Status = require('../../api/models/status');

// TODO: Allow for the creation of a mockJob using a mockSpec.
const mockJob = (_id, type, input, spec, author, creationTimeMs, status) => {
  const JobModel = getJobModel(type);
  if (!JobModel) {
    return `Error: Invalid \`type\` parameter (${type}).`;
  }

  return new JobModel({
    _id,
    type,
    input,
    spec,
    author,
    creationTimeMs,
    status,
  });
};

const nextMockJob = (type, status = Status.QUEUED) => {
  const jobId = nextMockObjectId();
  const input = nextMockObjectId();
  const spec = nextMockObjectId();
  const author = 'Test Author';
  const creationTimeMs = 0;
  return mockJob(jobId, type, input, spec, author, creationTimeMs, status);
};

const mockJobCreateJson = (type, inputId, specId) => JSON.stringify({
  type,
  inputId,
  specId,
});

const nextMockJobCreateJson = (type) => {
  const inputId = nextMockObjectId();
  const specId = nextMockObjectId();
  return mockJobCreateJson(type, inputId, specId);
};

const getJsonFromMockJob = (job) => {
  const { type } = job;
  const inputId = job.input.toString();
  const specId = job.spec.toString();
  return mockJobCreateJson(type, inputId, specId);
};

module.exports = {
  nextMockJob,
  nextMockJobCreateJson,
  getJsonFromMockJob,
};
