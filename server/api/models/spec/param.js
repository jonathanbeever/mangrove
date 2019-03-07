const { MAX_NUM_R } = require('../../../util/rConstants');

const Param = Object.freeze({
  aci: {
    minFreq: { default: 0, min: 0, max: MAX_NUM_R },
    maxFreq: { default: 96000, min: 0, max: MAX_NUM_R },
    j: { default: 5, min: 1, max: MAX_NUM_R },
    fftW: { default: 512, min: 1, max: MAX_NUM_R },
  },
  adi: {
    maxFreq: { default: 10000, min: 0, max: MAX_NUM_R },
    dbThreshold: { default: -50, min: -MAX_NUM_R, max: MAX_NUM_R },
    freqStep: { default: 1000, min: 1, max: MAX_NUM_R },
    shannon: { default: true },
  },
  aei: {
    maxFreq: { default: 10000, min: 0, max: MAX_NUM_R },
    dbThreshold: { default: -50, min: -MAX_NUM_R, max: MAX_NUM_R },
    freqStep: { default: 1000, min: 1, max: MAX_NUM_R },
  },
  bi: {
    minFreq: { default: 2000, min: 0, max: MAX_NUM_R },
    maxFreq: { default: 8000, min: 0, max: MAX_NUM_R },
    fftW: { default: 512, min: 1, max: MAX_NUM_R },
  },
  ndsi: {
    fftW: { default: 1024, min: 1, max: MAX_NUM_R },
    anthroMin: { default: 1000, min: 0, max: MAX_NUM_R },
    anthroMax: { default: 2000, min: 0, max: MAX_NUM_R },
    bioMin: { default: 2000, min: 0, max: MAX_NUM_R },
    bioMax: { default: 11000, min: 0, max: MAX_NUM_R },
  },
  rms: {},
});

module.exports = Param;
