const mockObjectId = require('./mockObjectId');

const { Job } = require('../../api/models/job');

let currId = 0;

// const mockSpec = () => {};

// const nextMockSpec = () => {};

// TODO: Allow for the creation of a mockJob using a mockSpec.
const mockJob = (
  id,
  type,
  input,
  spec,
  author = 'Test Author',
  creationTimeMs = 0,
  status = 'queued',
) => new Job({
  _id: id,
  type,
  input,
  spec,
  author,
  creationTimeMs,
  status,
});

const nextMockJob = (type) => {
  const id = mockObjectId(currId += 1);
  const input = mockObjectId(currId += 1);
  const spec = mockObjectId(currId += 1);
  return mockJob(id, type, input, spec);
};

module.exports = {
  // mockSpec,
  // nextMockSpec,
  mockJob,
  nextMockJob,
};
