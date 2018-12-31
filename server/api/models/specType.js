const {
  AciSpec,
  AdiSpec,
  AeiSpec,
  BiSpec,
  NdsiSpec,
  RmsSpec,
} = require('../models/spec');

const specType = Object.freeze({
  ACI: 'aciSpec',
  ADI: 'adiSpec',
  AEI: 'aeiSpec',
  BI: 'biSpec',
  NDSI: 'ndsiSpec',
  RMS: 'rmsSpec',
  null: null,
});

const getSpecType = function getSpecType(spec) {
  switch (spec) {
    case specType.ACI:
      return AciSpec;
    case specType.ADI:
      return AdiSpec;
    case specType.AEI:
      return AeiSpec;
    case specType.BI:
      return BiSpec;
    case specType.NDSI:
      return NdsiSpec;
    case specType.RMS:
      return RmsSpec;
    default:
      return specType.null;
  }
};
module.exports = { specType, getSpecType };
