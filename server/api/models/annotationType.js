const Type = require('./type');

const AnnotationType = Object.freeze({
  ACI: `${Type.ACI}Annotation`,
  ADI: `${Type.ADI}Annotation`,
  AEI: `${Type.AEI}Annotation`,
  BI: `${Type.BI}Annotation`,
  NDSI: `${Type.NDSI}Annotation`,
  RMS: `${Type.RMS}Annotation`,
  ML: `${Type.ML}Annotation`,
});

module.exports = AnnotationType;
