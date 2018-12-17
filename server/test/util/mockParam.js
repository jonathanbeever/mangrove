const { specType } = require('../../api/models/specType');
const {
  AciSpec,
  AeiSpec,
  AdiSpec,
  BiSpec,
  NdsiSpec,
  RmsSpec,
} = require('../../api/models/spec');

const checkDefault = (type, param) => {
  switch (type) {
    case specType.ACI:
      if (
        param.minFreq === 0
        && param.maxFreq === 16000
        && param.j === 30
        && param.fftW === 10
      ) {
        return true;
      }
      return false;
    case specType.ADI:
      if (
        param.maxFreq === 16000
        && param.dbThreshold === 32
        && param.freqStep === 512
        && param.shannon === true
      ) {
        return true;
      }
      return false;
    case specType.AEI:
      if (
        param.maxFreq === 16000
        && param.dbThreshold === 32
        && param.freqStep === 512
      ) {
        return true;
      }
      return false;
    case specType.BI:
      if (param.minFreq === 0 && param.maxFreq === 16000 && param.fftW === 10) {
        return true;
      }
      return false;

    case specType.NDSI:
      if (
        param.fftW === 10
        && param.anthroMin === 5001
        && param.anthroMax === 20000
        && param.bioMin === 0
        && param.bioMax === 5000
      ) {
        return true;
      }
      return false;

    case specType.RMS:
      return true;

    default:
      return `Error: Invalid \`type\` parameter (${type}).`;
  }
};
const checkKeys = (type, keys, param) => {
  if (keys.length !== Object.keys(param).length) {
    return `${type} was given too many paramaters (${param})`;
  }
  keys.forEach((key) => {
    if (!(key in param)) {
      return `${type} was given incorrect paramaters (${param})`;
    }
  });

  return param;
};

const mockParameter = (type, param, trim = false) => {
  let typeKeys = [];
  const paramaters = param;
  // used in testing to get rid of the base params
  if (trim) {
    delete paramaters._id;
    delete paramaters.__v;
    delete paramaters.type;
  }
  switch (type) {
    case specType.ACI:
      typeKeys = Object.keys(AciSpec.schema.obj);
      // deleting parent class spec varaibles as they do not need to be checked.
      typeKeys.splice(typeKeys.length - 1, 1);
      return checkKeys(specType.ACI, typeKeys, paramaters);
    case specType.ADI:
      typeKeys = Object.keys(AdiSpec.schema.obj);
      typeKeys.splice(typeKeys.length - 1, 1);
      return checkKeys(specType.ADI, typeKeys, paramaters);
    case specType.AEI:
      typeKeys = Object.keys(AeiSpec.schema.obj);
      typeKeys.splice(typeKeys.length - 1, 1);
      return checkKeys(specType.AEI, typeKeys, paramaters);
    case specType.BI:
      typeKeys = Object.keys(BiSpec.schema.obj);
      typeKeys.splice(typeKeys.length - 1, 1);
      return checkKeys(specType.BI, typeKeys, paramaters);
    case specType.NDSI:
      typeKeys = Object.keys(NdsiSpec.schema.obj);
      typeKeys.splice(typeKeys.length - 1, 1);
      return checkKeys(specType.NDSI, typeKeys, paramaters);
    case specType.RMS:
      typeKeys = Object.keys(RmsSpec.schema.obj);
      typeKeys.splice(typeKeys.length - 1, 1);
      return checkKeys(specType.RMS, typeKeys, paramaters);
    default:
      return `Error: Invalid \`type\` parameter (${type}).`;
  }
};

module.exports = { mockParameter, checkDefault };
