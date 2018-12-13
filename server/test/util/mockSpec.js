const { nextMockObjectId } = require('./mockObjectId');
// const mockParams = require('./mockParams');

// const {
//   AciSpec, AdiSpec, AeiSpec, BiSpec, NdsiSpec, RmsSpec,
// } = require('../../api/models/spec');
const { Spec } = require('../../api/models/spec');

const mockSpec = (
  _id,
  type,
  param = {},
  creationTimeMs = 0,
  author = 'Test Author',
) => new Spec({
  _id,
  type,
  ...param,
  creationTimeMs,
  author,
});

// TODO: Create parameter validation.
const nextMockSpec = (type, param) => {
  const id = nextMockObjectId();
  return mockSpec(id, type, param);
};

module.exports = {
  nextMockSpec,
};
