const AnnotationGraphType = Object.freeze({
  // ACI Graphs
  ACIBySecondsPerFile: 'ACI By Seconds Per File',
  ACIBySeconds: 'ACI By Seconds',
  ACITotOverMin: 'ACI Total Value Divided By Minutes',
  ACIByBand: 'ACI By Band Range',
  ACIByDateHour: 'ACI By Date And Hour',
  ACIByFile: 'ACI By File',

  ACICompareByFile: 'Compared By File',
  ACIComparedOverSecPerFile: 'Compared Over Seconds Per File',
  ACICompareByBand: 'Compared By Band Values',
  ACICompareDate: 'Compared Date',

  // NDSI Graphs
  NDSI: 'NDSI Values',
  NDSIByChannel: 'NDSI By Channel',
  NDSIByDateHour: 'NDSI By Date and Hour',
  NDSIByFile: 'NDSI Values By File',

  NDSICompareByChannels: 'Compared By Channels',
  NDSICompareByValues: 'Compared By Values',
  NDSICompareByFile: 'Compared By File',

  // ADI Graphs
  ADIByBand: 'ADI Value By Band Range',
  ADIBandByFile: 'ADI Band Range Values By File',
  ADIAveByFile: 'ADI Average By File',
  ADIAveByDateHour: 'ADI Average By Date And Hour',

  ADICompareByBand: 'Compared By Band Values',
  ADICompareByDate: 'Compared By Date',

  // AEI Graphs
  AEIByBand: 'AEI By Band Range',
  AEIBandByFile: 'AEI Band Range Values By File',
  AEIByFile: 'AEI By File',
  AEIByDateHour: 'AEI By Date And Hour',

  AEICompareByBand: 'Compared By Band Values',
  AEICompareByDate: 'Compared By Date',

  // BI Graphs
  BIByFile: 'Bioacoustic Value By File',
  BISpectrum: 'Bioacoustic Spectrum Values',
  BIAreaByFile: 'Bioacoustic Area Value By File',
  BIAreaByDateHour: 'Bioacoustic Area Value By Date And Hour',

  BICompareBySpectrum: 'Compared By Spectrum Values',
  BICompareByDate: 'Compared By Date',

  // ML Graphs
  MLResults: 'Sound Types',
});

module.exports = AnnotationGraphType;
