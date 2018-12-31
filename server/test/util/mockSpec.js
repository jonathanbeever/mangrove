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
    param,
  });
};

const nextUncheckedMockSpec = (type, param) => {
  const specId = nextMockObjectId();
  return mockSpec(specId, type, param);
};

const nextMockSpec = (type, param) => {
  const specId = nextMockObjectId();
  const params = mockParameter(type, param);
  return mockSpec(specId, type, params);
};

const mockSpecCreateJson = (type, param) => {
  const checkedParam = mockParameter(type, param);
  return JSON.stringify({
    specType: type,
    ...checkedParam,
  });
};

// TODO: get json from spec
const getJsonFromMockSpec = spec => JSON.stringify(spec);
module.exports = {
  nextMockSpec,
  mockSpecCreateJson,
  getJsonFromMockSpec,
  nextUncheckedMockSpec,
};
