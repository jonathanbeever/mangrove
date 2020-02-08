const Type = require('./type');

const JobType = Object.freeze({
  ACI: `${Type.ACI}Job`,
  ADI: `${Type.ADI}Job`,
  AEI: `${Type.AEI}Job`,
  BI: `${Type.BI}Job`,
  NDSI: `${Type.NDSI}Job`,
  RMS: `${Type.RMS}Job`,
  ML: `${Type.ML}Job`,
});

module.exports = JobType;
