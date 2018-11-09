const mockObjectId = require('./mockObjectId');

const Job = require('../../api/models/job');

let currId = 0;

// TODO: Allow for the creation of a mockJob using a mockSpec.

const mockJob = (
  id,
  type,
  input,
  jobSpec,
  author = 'Test Author',
  creationTimeMs = 0,
  status = 'queued',
) => new Job({
  _id: id,
  type,
  input,
  jobSpec,
  author,
  creationTimeMs,
  status,
});

const nextMockJob = (type) => {
  const id = mockObjectId(currId += 1);
  const input = mockObjectId(currId += 1);
  const jobSpec = mockObjectId(currId += 1);
  return mockJob(id, type, input, jobSpec);
};

module.exports = {
  mockJob,
  nextMockJob,
};
