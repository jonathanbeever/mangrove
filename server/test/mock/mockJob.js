const { nextMockInput } = require('./mockInput');
const { mockSpec } = require('./mockSpec');
const { nextMockObjectId } = require('./mockObjectId');

const Input = require('../../api/models/input');
const { Spec } = require('../../api/models/spec');
const { Job } = require('../../api/models/job');
const { specTypeToType } = require('../../api/models/spec/utils');
const { getJobModel } = require('../../api/models/job/utils');
const Status = require('../../api/models/status');

const mockJob = (_id, type, input, spec, author, creationTimeMs, status) => {
  const JobModel = getJobModel(type);
  if (!JobModel) {
    throw new Error(`Invalid 'type' parameter (${type}).`);
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

const nextMockJob = (type, status = Status.WAITING) => {
  const jobId = nextMockObjectId();
  const input = nextMockObjectId();
  const spec = nextMockObjectId();
  const author = 'Test Author';
  const creationTimeMs = 0;
  return mockJob(jobId, type, input, spec, author, creationTimeMs, status);
};

const nextMockPopulatedJob = (
  type,
  status = Status.QUEUED,
  mockedInput = null,
  mockedSpec = null,
) => new Promise((resolve, reject) => {
  if (mockedSpec && type !== specTypeToType(mockedSpec.type)) {
    throw new Error('`type` does not correspond to `mockedSpec.type`');
  }

  const input = mockedInput || nextMockInput();
  const spec = mockedSpec || mockSpec(nextMockObjectId(), type, {});
  const jobId = nextMockObjectId();
  const author = 'Test Author';
  const creationTimeMs = 0;

  const job = mockJob(
    jobId,
    type,
    input.id,
    spec.id,
    author,
    creationTimeMs,
    status,
  );

  return Promise.all([
    Input.create(input),
    Spec.create(spec),
    Job.create(job),
  ])
    .then((createResults) => {
      Job.findOne(createResults[2])
        .populate('input')
        .populate('spec')
        .then(populatedJob => resolve(populatedJob))
        .catch(err => reject(err));
    })
    .catch(err => reject(err));
});

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
  nextMockPopulatedJob,
  nextMockJobCreateJson,
  getJsonFromMockJob,
};
