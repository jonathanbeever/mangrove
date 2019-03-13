const { nextMockObjectId } = require('./mockObjectId');
const { nextMockParams } = require('./mockParam');

const {
  getSpecModel,
  getParamsFromSpec,
} = require('../../api/models/spec/utils');

const mockSpec = (_id, type, params) => {
  const SpecModel = getSpecModel(type);
  return new SpecModel({
    _id,
    type,
    ...params,
  });
};

const nextMockSpec = (type) => {
  const specId = nextMockObjectId();
  const params = nextMockParams(type);
  return mockSpec(specId, type, params);
};

const mockSpecCreateJson = (type, params) => JSON.stringify({
  type,
  ...params,
});

const nextMockSpecCreateJson = (type) => {
  const params = nextMockParams(type);
  return mockSpecCreateJson(type, params);
};

const getJsonFromMockSpec = (spec) => {
  const params = getParamsFromSpec(spec);
  return mockSpecCreateJson(spec.type, params);
};

module.exports = {
  mockSpec,
  nextMockSpec,
  mockSpecCreateJson,
  nextMockSpecCreateJson,
  getJsonFromMockSpec,
};
