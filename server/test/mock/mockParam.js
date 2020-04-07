const Param = require('../../api/models/spec/param');

const currParam = {
  aci: {
    minFreq: Param.aci.minFreq.min,
    maxFreq: Param.aci.maxFreq.min,
    j: Param.aci.j.min,
    fftW: Param.aci.fftW.min,
  },
  adi: {
    maxFreq: Param.adi.maxFreq.min,
    dbThreshold: Param.adi.dbThreshold.min,
    freqStep: Param.adi.freqStep.min,
    shannon: Param.adi.shannon.default,
  },
  aei: {
    maxFreq: Param.aei.maxFreq.min,
    dbThreshold: Param.aei.dbThreshold.min,
    freqStep: Param.aei.freqStep.min,
  },
  bi: {
    minFreq: Param.bi.minFreq.min,
    maxFreq: Param.bi.maxFreq.min,
    fftW: Param.bi.fftW.min,
  },
  ndsi: {
    fftW: Param.ndsi.fftW.min,
    anthroMin: Param.ndsi.anthroMin.min,
    anthroMax: Param.ndsi.anthroMax.min,
    bioMin: Param.ndsi.bioMin.min,
    bioMax: Param.ndsi.bioMax.min,
  },
  rms: {
    // N/A
  },
  ml: {
    // N/A
  },
};

const nextMockParam = (type, param) => {
  const varType = typeof Param[type][param].default;
  if (varType === 'number') {
    currParam[type][param] = currParam[type][param] + 1 > Param[type][param].max
      ? Param[type][param].min
      : currParam[type][param] + 1;
  } else if (varType === 'boolean') {
    currParam[type][param] = !currParam[type][param];
  }
  return currParam[type][param];
};

const nextMockParams = (type) => {
  Object.keys(currParam[type]).forEach((param) => {
    nextMockParam(type, param);
  });
  return currParam[type];
};

module.exports = {
  nextMockParams,
};
