const { nextMockObjectId } = require('./mockObjectId');
const { nextMockParams } = require('./mockParam');

const {
  typeToSpecType,
  specTypeToType,
  getSpecModel,
  getParamsFromSpec,
} = require('../../api/models/spec/utils');

const mockSpec = (_id, type, params) => {
  const specType = typeToSpecType(type);
  const SpecModel = getSpecModel(specType);
  if (SpecModel === null) {
    throw new Error(`Invalid 'type' parameter (${type}).`);
  }

  return new SpecModel({
    _id,
    specType,
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
  const type = specTypeToType(spec.type);
  const params = getParamsFromSpec(spec);
  return mockSpecCreateJson(type, params);
};

module.exports = {
  mockSpec,
  nextMockSpec,
  mockSpecCreateJson,
  nextMockSpecCreateJson,
  getJsonFromMockSpec,
};
