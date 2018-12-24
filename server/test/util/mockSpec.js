const { nextMockObjectId } = require('./mockObjectId');
const { mockParameter } = require('./mockParam');
const {
  AciSpec,
  AeiSpec,
  AdiSpec,
  BiSpec,
  NdsiSpec,
  RmsSpec,
} = require('../../api/models/spec');

const { specType } = require('../../api/models/specType');

const mockSpec = (_id, type, param) => {
  let SpecModel = null;
  switch (type) {
    case specType.ACI:
      SpecModel = AciSpec;
      break;
    case specType.ADI:
      SpecModel = AdiSpec;
      break;
    case specType.AEI:
      SpecModel = AeiSpec;
      break;
    case specType.BI:
      SpecModel = BiSpec;
      break;
    case specType.NDSI:
      SpecModel = NdsiSpec;
      break;
    case specType.RMS:
      SpecModel = RmsSpec;
      break;
    default:
      return `Error: Invalid \`type\` parameter (${type}).`;
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
