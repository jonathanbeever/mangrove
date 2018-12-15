const { nextMockObjectId } = require('./mockObjectId');

const {
  AciJob, AdiJob, AeiJob, BiJob, NdsiJob, RmsJob,
} = require('../../api/models/job');
const Type = require('../../api/models/type');
const Status = require('../../api/models/status');

// TODO: Allow for the creation of a mockJob using a mockSpec.
const mockJob = (_id, type, input, spec, author, creationTimeMs, status) => {
  let JobModel = null;
  switch (type) {
    case Type.ACI:
      JobModel = AciJob; break;
    case Type.ADI:
      JobModel = AdiJob; break;
    case Type.AEI:
      JobModel = AeiJob; break;
    case Type.BI:
      JobModel = BiJob; break;
    case Type.NDSI:
      JobModel = NdsiJob; break;
    case Type.RMS:
      JobModel = RmsJob; break;
    default:
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

module.exports = {
  nextMockJob,
  nextMockJobCreateJson,
};
