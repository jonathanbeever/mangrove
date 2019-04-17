const moment = require('moment');

const { nextMockInput } = require('./mockInput');
const { mockSpec } = require('./mockSpec');
const { nextMockObjectId } = require('./mockObjectId');

const Input = require('../../api/models/input');
const { Spec } = require('../../api/models/spec');
const { Job } = require('../../api/models/job');
const {
  typeToJobType,
  getJobModel,
} = require('../../api/models/job/utils');
const Status = require('../../api/models/status');

const mockJob = (_id, type, input, spec, author, creationTimeMs, status) => {
  const JobModel = getJobModel(type);
  const jobType = typeToJobType(type);
  return new JobModel({
    _id,
    jobType,
    input,
    spec,
    author,
    creationTimeMs,
    status,
  });
};

const nextMockJob = async (type, status = Status.WAITING) => {
  const jobId = nextMockObjectId();
  const input = nextMockInput();
  const spec = mockSpec(nextMockObjectId(), type, {});
  const author = 'aninjnlx@sharklasers.com';
  const creationTimeMs = moment().valueOf();

  await Input.create(input);
  await Spec.create(spec);

  return mockJob(
    jobId,
    type,
    input.id,
    spec.id,
    author,
    creationTimeMs,
    status,
  );
};

const nextMockPopulatedJob = async (
  type,
  status = Status.QUEUED,
  mockedInput = null,
  mockedSpec = null,
) => {
  if (mockedSpec && type !== mockedSpec.type) {
    throw new Error('`type` does not match `mockedSpec.type`');
  }

  const jobId = nextMockObjectId();
  const input = mockedInput || nextMockInput();
  const spec = mockedSpec || mockSpec(nextMockObjectId(), type, {});
  const author = 'Test Author';
  const creationTimeMs = moment().valueOf();

  const job = mockJob(
    jobId,
    type,
    input.id,
    spec.id,
    author,
    creationTimeMs,
    status,
  );

  await Input.create(input);
  await Spec.create(spec);
  const createdJob = await Job.create(job);

  const searchResult = await Job.findOne(createdJob)
    .populate('input')
    .populate('spec');
  return searchResult;
};

const mockJobCreateJson = (inputId, specId) => JSON.stringify({
  input: inputId,
  spec: specId,
});

const getJsonFromMockJob = (job) => {
  const inputId = job.input.toString();
  const specId = job.spec.toString();
  return mockJobCreateJson(inputId, specId);
};

module.exports = {
  nextMockJob,
  nextMockPopulatedJob,
  getJsonFromMockJob,
};
