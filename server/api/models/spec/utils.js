const AciSpec = require('./aci');
const AdiSpec = require('./adi');
const AeiSpec = require('./aei');
const BiSpec = require('./bi');
const NdsiSpec = require('./ndsi');
const RmsSpec = require('./rms');

const Type = require('../type');
const SpecType = require('../specType');
const Param = require('./param');

const typeToSpecType = (type) => {
  switch (type) {
    case Type.ACI: return SpecType.ACI;
    case Type.ADI: return SpecType.ADI;
    case Type.AEI: return SpecType.AEI;
    case Type.BI: return SpecType.BI;
    case Type.NDSI: return SpecType.NDSI;
    case Type.RMS: return SpecType.RMS;
    default: return null;
  }
};

const specTypeToType = (specType) => {
  switch (specType) {
    case SpecType.ACI: return Type.ACI;
    case SpecType.ADI: return Type.ADI;
    case SpecType.AEI: return Type.AEI;
    case SpecType.BI: return Type.BI;
    case SpecType.NDSI: return Type.NDSI;
    case SpecType.RMS: return Type.RMS;
    default: return null;
  }
};

const getSpecModel = (specType) => {
  switch (specType) {
    case SpecType.ACI: return AciSpec;
    case SpecType.ADI: return AdiSpec;
    case SpecType.AEI: return AeiSpec;
    case SpecType.BI: return BiSpec;
    case SpecType.NDSI: return NdsiSpec;
    case SpecType.RMS: return RmsSpec;
    default: return null;
  }
};

const getSpecKeys = (specType) => {
  const SpecModel = getSpecModel(specType);
  if (!SpecModel) {
    return `Error: Invalid \`specType\` parameter (${specType}).`;
  }

  const keys = Object.keys(SpecModel.schema.paths);
  keys[keys.indexOf('_id')] = 'specId';
  keys.splice(keys.indexOf('__v'), 1);

  return keys;
};

const newSpecKeys = (specType, includeOptional = false) => {
  if (includeOptional) {
    const keys = getSpecKeys(specType);
    keys.splice(keys.indexOf('specId'), 1);
    return keys;
  }
  return ['type'];
};

const getSpecParams = (specType) => {
  const keys = getSpecKeys(specType);
  keys.splice(keys.indexOf('specId'), 1);
  keys.splice(keys.indexOf('type'), 1);
  return keys;
};

const getParamsFromSpec = (spec) => {
  if (spec.type === SpecType.ACI || spec.type === Type.ACI) {
    return {
      ...(typeof spec.minFreq !== 'undefined' && { minFreq: spec.minFreq }),
      ...(typeof spec.maxFreq !== 'undefined' && { maxFreq: spec.maxFreq }),
      ...(typeof spec.j !== 'undefined' && { j: spec.j }),
      ...(typeof spec.fftW !== 'undefined' && { fftW: spec.fftW }),
    };
  } if (spec.type === SpecType.ADI || spec.type === Type.ADI) {
    return {
      ...(typeof spec.maxFreq !== 'undefined' && { maxFreq: spec.maxFreq }),
      ...(typeof spec.dbThreshold !== 'undefined' && { dbThreshold: spec.dbThreshold }),
      ...(typeof spec.freqStep !== 'undefined' && { freqStep: spec.freqStep }),
      ...(typeof spec.shannon !== 'undefined' && { shannon: spec.shannon }),
    };
  } if (spec.type === SpecType.AEI || spec.type === Type.AEI) {
    return {
      ...(typeof spec.maxFreq !== 'undefined' && { maxFreq: spec.maxFreq }),
      ...(typeof spec.dbThreshold !== 'undefined' && { dbThreshold: spec.dbThreshold }),
      ...(typeof spec.freqStep !== 'undefined' && { freqStep: spec.freqStep }),
    };
  } if (spec.type === SpecType.BI || spec.type === Type.BI) {
    return {
      ...(typeof spec.minFreq !== 'undefined' && { minFreq: spec.minFreq }),
      ...(typeof spec.maxFreq !== 'undefined' && { maxFreq: spec.maxFreq }),
      ...(typeof spec.fftW !== 'undefined' && { fftW: spec.fftW }),
    };
  } if (spec.type === SpecType.NDSI || spec.type === Type.NDSI) {
    return {
      ...(typeof spec.fftW !== 'undefined' && { fftW: spec.fftW }),
      ...(typeof spec.anthroMin !== 'undefined' && { anthroMin: spec.anthroMin }),
      ...(typeof spec.anthroMax !== 'undefined' && { anthroMax: spec.anthroMax }),
      ...(typeof spec.bioMin !== 'undefined' && { bioMin: spec.bioMin }),
      ...(typeof spec.bioMax !== 'undefined' && { bioMax: spec.bioMax }),
    };
  } if (spec.type === SpecType.RMS || spec.type === Type.RMS) {
    return {
      // TODO
    };
  }
  return null;
};

// FIXME: Find a cleaner way to extract the type from a Mongoose model's key
const getParamVarType = (type, param) => {
  const SpecModel = getSpecModel(typeToSpecType(type));
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
  typeToSpecType,
  specTypeToType,
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
