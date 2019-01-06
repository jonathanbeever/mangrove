const { specType } = require('../../api/models/specType');
const { specDefaults } = require('../../api/models/specDefaults');
const {
  AciSpec,
  AeiSpec,
  AdiSpec,
  BiSpec,
  NdsiSpec,
  RmsSpec,
} = require('../../api/models/spec');

const checkDefault = (type, param) => {
  const newType = type.substring(0, type.length - 4);
  Object.keys(specDefaults[newType]).forEach((params) => {
    if (param[params] !== specDefaults[newType][params].default) {
      return false;
    }
  });
  return true;
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
