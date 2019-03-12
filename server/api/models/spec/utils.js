const AciSpec = require('./aci');
const AdiSpec = require('./adi');
const AeiSpec = require('./aei');
const BiSpec = require('./bi');
const NdsiSpec = require('./ndsi');
const RmsSpec = require('./rms');

const Type = require('../type');
const Param = require('./param');

const getSpecModel = (type) => {
  switch (type) {
    case Type.ACI: return AciSpec;
    case Type.ADI: return AdiSpec;
    case Type.AEI: return AeiSpec;
    case Type.BI: return BiSpec;
    case Type.NDSI: return NdsiSpec;
    case Type.RMS: return RmsSpec;
    default: throw new Error(`Invalid \`type\` parameter (${type}).`);
  }
};

const getSpecKeys = (type) => {
  const SpecModel = getSpecModel(type);
  const keys = Object.keys(SpecModel.schema.paths);
  keys[keys.indexOf('_id')] = 'specId';
  // The following keys are never shown to users
  keys.splice(keys.indexOf('__v'), 1);

  return keys;
};

const newSpecKeys = (type, includeOptional = false) => {
  if (includeOptional) {
    const keys = getSpecKeys(type);
    keys.splice(keys.indexOf('specId'), 1);
    return keys;
  }
  return ['type'];
};

const getSpecParams = (type) => {
  const keys = getSpecKeys(type);
  keys.splice(keys.indexOf('specId'), 1);
  keys.splice(keys.indexOf('type'), 1);
  return keys;
};

const getParamsFromSpec = (spec) => {
  switch (spec.type) {
    case Type.ACI:
      return {
        ...(typeof spec.minFreq !== 'undefined' && { minFreq: spec.minFreq }),
        ...(typeof spec.maxFreq !== 'undefined' && { maxFreq: spec.maxFreq }),
        ...(typeof spec.j !== 'undefined' && { j: spec.j }),
        ...(typeof spec.fftW !== 'undefined' && { fftW: spec.fftW }),
      };
    case Type.ADI:
      return {
        ...(typeof spec.maxFreq !== 'undefined' && { maxFreq: spec.maxFreq }),
        ...(typeof spec.dbThreshold !== 'undefined' && { dbThreshold: spec.dbThreshold }),
        ...(typeof spec.freqStep !== 'undefined' && { freqStep: spec.freqStep }),
        ...(typeof spec.shannon !== 'undefined' && { shannon: spec.shannon }),
      };
    case Type.AEI:
      return {
        ...(typeof spec.maxFreq !== 'undefined' && { maxFreq: spec.maxFreq }),
        ...(typeof spec.dbThreshold !== 'undefined' && { dbThreshold: spec.dbThreshold }),
        ...(typeof spec.freqStep !== 'undefined' && { freqStep: spec.freqStep }),
      };
    case Type.BI:
      return {
        ...(typeof spec.minFreq !== 'undefined' && { minFreq: spec.minFreq }),
        ...(typeof spec.maxFreq !== 'undefined' && { maxFreq: spec.maxFreq }),
        ...(typeof spec.fftW !== 'undefined' && { fftW: spec.fftW }),
      };
    case Type.NDSI:
      return {
        ...(typeof spec.fftW !== 'undefined' && { fftW: spec.fftW }),
        ...(typeof spec.anthroMin !== 'undefined' && { anthroMin: spec.anthroMin }),
        ...(typeof spec.anthroMax !== 'undefined' && { anthroMax: spec.anthroMax }),
        ...(typeof spec.bioMin !== 'undefined' && { bioMin: spec.bioMin }),
        ...(typeof spec.bioMax !== 'undefined' && { bioMax: spec.bioMax }),
      };
    case Type.RMS:
      return {
        // TODO
      };
    default:
      throw new Error(`Invalid \`type\` parameter (${spec.type}).`);
  }
};

// FIXME: Find a cleaner way to extract the type from a Mongoose model's key
const getParamVarType = (type, param) => {
  const SpecModel = getSpecModel(type);
  if (SpecModel.schema.obj[param].type.toString().includes('Number')) {
    return 'number';
  }
  if (SpecModel.schema.obj[param].type.toString().includes('Boolean')) {
    return 'boolean';
  }
  return null;
};

const validateParam = (type, param, value) => {
  const varType = getParamVarType(type, param);
  if (varType === 'number') {
    if (typeof value !== 'number') {
      throw new Error(`Unexpected value type: ${typeof value}. Expected number.`);
    } else if (value < Param[type][param].min) {
      throw new Error(`Value ${value} too low to create ${param} (${type}).`);
    } else if (value > Param[type][param].max) {
      throw new Error(`Value ${value} too high to create ${param} (${type}).`);
    }
  } else if (varType === 'boolean') {
    if (typeof value !== 'boolean') {
      throw new Error(`Unexpected value type: ${typeof value}. Expected boolean.`);
    }
  }
  return value;
};

const validateParams = (type, params) => {
  const invalid = [];
  Object.entries(params).forEach(([key, value]) => {
    try {
      validateParam(type, key, value);
    } catch (err) {
      invalid.push(key);
    }
  });

  if (invalid.length > 0) {
    throw new Error(`Invalid values for keys: ${invalid.join(', ')} (type: ${type})`);
  }

  return params;
};

const fillDefaultParams = (type, params) => {
  const filledParams = params;
  Object.keys(Param[type]).forEach((key) => {
    if (!(key in filledParams)) {
      filledParams[key] = Param[type][key].default;
    }
  });

  return filledParams;
};

module.exports = {
  getSpecModel,
  getSpecKeys,
  newSpecKeys,
  getSpecParams,
  getParamsFromSpec,
  getParamVarType,
  validateParam,
  validateParams,
  fillDefaultParams,
};
