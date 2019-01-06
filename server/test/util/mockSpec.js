const { nextMockObjectId } = require('./mockObjectId');
const { mockParameter } = require('./mockParam');

const { getSpecType } = require('../../api/models/specType');

const mockSpec = (_id, type, param) => {
  let SpecModel = null;
  SpecModel = getSpecType(type);
  if (SpecModel === null) {
    return `Error with spec type :: ${type}`;
  }

  return new SpecModel({
    _id,
    type,
    ...param,
  });
};

const nextMockSpec = (type, param, check = true) => {
  const specId = nextMockObjectId();
  let params = param;
  if (check) {
    params = mockParameter(type, param);
  }
  return mockSpec(specId, type, params);
};

const mockSpecCreateJson = (type, param) => JSON.stringify({
  type,
  ...param,
});

// TODO: get json from spec
const getJsonFromMockSpec = spec => JSON.stringify(spec);
module.exports = {
  nextMockSpec,
  mockSpecCreateJson,
  getJsonFromMockSpec,
};
