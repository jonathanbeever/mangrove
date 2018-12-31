const specDefaults = Object.freeze({
  aci: {
    minFreq: 0,
    maxFreq: 16000,
    j: 30,
    fftW: 10,
  },
  adi: {
    maxFreq: 16000, dbThreshold: 32, freqStep: 512, shannon: true,
  },
  aei: { maxFreq: 16000, dbThreshold: 32, freqStep: 512 },
  bi: { minFreq: 0, maxFreq: 16000, fftW: 10 },
  ndsi: {
    fftW: 10,
    anthroMin: 5001,
    anthroMax: 20000,
    bioMin: 0,
    bioMax: 5000,
  },
  rms: {},
});

module.exports = { specDefaults };
