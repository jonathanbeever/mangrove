const { MAX_NUM_R } = require('../../../util/rConstants');

const Param = Object.freeze({
  aci: {
    minFreq: { default: 0, min: 0, max: MAX_NUM_R },
    maxFreq: { default: 16000, min: 0, max: MAX_NUM_R },
    j: { default: 30, min: 1, max: MAX_NUM_R },
    fftW: { default: 10, min: 1, max: MAX_NUM_R },
  },
  adi: {
    maxFreq: { default: 16000, min: 0, max: MAX_NUM_R },
    dbThreshold: { default: 32, min: -MAX_NUM_R, max: MAX_NUM_R },
    freqStep: { default: 512, min: 1, max: MAX_NUM_R },
    shannon: { default: true },
  },
  aei: {
    maxFreq: { default: 16000, min: 0, max: MAX_NUM_R },
    dbThreshold: { default: 32, min: -MAX_NUM_R, max: MAX_NUM_R },
    freqStep: { default: 512, min: 1, max: MAX_NUM_R },
  },
  bi: {
    minFreq: { default: 0, min: 0, max: MAX_NUM_R },
    maxFreq: { default: 16000, min: 0, max: MAX_NUM_R },
    fftW: { default: 10, min: 1, max: MAX_NUM_R },
  },
  ndsi: {
    fftW: { default: 10, min: 1, max: MAX_NUM_R },
    anthroMin: { default: 5001, min: 0, max: MAX_NUM_R },
    anthroMax: { default: 20000, min: 0, max: MAX_NUM_R },
    bioMin: { default: 0, min: 0, max: MAX_NUM_R },
    bioMax: { default: 5000, min: 0, max: MAX_NUM_R },
  },
  rms: {},
});

module.exports = Param;
