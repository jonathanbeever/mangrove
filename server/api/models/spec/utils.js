const AciSpec = require('./aci');
const AdiSpec = require('./adi');
const AeiSpec = require('./aei');
const BiSpec = require('./bi');
const NdsiSpec = require('./ndsi');
const RmsSpec = require('./rms');
const MlSpec = require('./ml');

const Type = require('../type');
const Param = require('./param');
const Nyquist = require('./nyquist');

const getSpecModel = (type) => {
  switch (type) {
    case Type.ACI: return AciSpec;
    case Type.ADI: return AdiSpec;
    case Type.AEI: return AeiSpec;
    case Type.BI: return BiSpec;
    case Type.NDSI: return NdsiSpec;
    case Type.RMS: return RmsSpec;
    case Type.ML: return MlSpec;
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

function showNyquistAs(nyquistType = undefined, aciMaxFreq) {
  switch (nyquistType) {
    case Nyquist.db.type:
      return aciMaxFreq === Nyquist.user.value ? Nyquist.db.value : aciMaxFreq;
    case Nyquist.user.type:
      return aciMaxFreq === Nyquist.db.value ? Nyquist.user.value : aciMaxFreq;
    default:
      return aciMaxFreq;
  }
}

const getParamsFromSpec = (spec, nyquistType = undefined) => {
  switch (spec.type) {
    case Type.ACI:
      return {
        ...(typeof spec.minFreq !== 'undefined' && { minFreq: spec.minFreq }),
        ...(typeof spec.maxFreq !== 'undefined' && {
          maxFreq: showNyquistAs(nyquistType, spec.maxFreq),
        }),
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
        // N/A
      };
    default:
      throw new Error(`Invalid \`type\` parameter (${spec.type}).`);
  }
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
  fillDefaultParams,
};
