const Type = require('./type');

const AnnotationType = Object.freeze({
  ACI: `${Type.ACI}Annotation`,
  ADI: `${Type.ADI}Annotation`,
  AEI: `${Type.AEI}Annotation`,
  BI: `${Type.BI}Annotation`,
  NDSI: `${Type.NDSI}Annotation`,
  RMS: `${Type.RMS}Annotation`,
  ML: `${Type.ML}Annotation`,
  ACICompare: `${Type.ACI}-compareAnnotation`,
  ADICompare: `${Type.ADI}-compareAnnotation`,
  AEICompare: `${Type.AEI}-compareAnnotation`,
  BICompare: `${Type.BI}-compareAnnotation`,
  NDSICompare: `${Type.NDSI}-compareAnnotation`,
  RMSCompare: `${Type.RMS}-compareAnnotation`,
  MLCompare: `${Type.ML}-compareAnnotation`,

});

module.exports = AnnotationType;
