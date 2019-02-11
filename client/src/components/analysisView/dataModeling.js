/********** Core helper functions **********/
export function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

export function extend(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}

export function mergeLikeNames(inputArray) {
  let ret = [];
  let len = inputArray.length;
  for(let i = 0; i < len; i++)
  {
    if(i > 0 && inputArray[i].name === inputArray[i - 1].name) continue;
    if(i === len - 1)
    {
      ret.push(inputArray[i]);
      continue;
    }

    if(inputArray[i].name === inputArray[i + 1].name)
    {
      // we can merge the next two
      ret.push(extend(inputArray[i], inputArray[i + 1]));
    }else ret.push(inputArray[i]);
  }

  return ret;
}

export function createSpecTitle(spec) {
  // var params = Object.keys(indexedSpecs[spec]);
  var params = Object.keys(spec);
  params.splice(params.indexOf('specId'), 1);
  params.splice(params.indexOf('type'), 1);
  var specTitle = '';

  params.forEach((param, i) => {
    if(i === params.length - 1)
    {
      specTitle = specTitle + param + ' - ' + spec[param];
    }else
    {
      specTitle = specTitle + param + ' - ' + spec[param] + ', ';
    }
  });

  return specTitle;
}

// Checks if a passed object is empty
export function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

/********** Base graph data modeling functions **********/
export function convertNDSIResults(jobs) {
  let ret;

  let ndsiLTotal = 0;
  let ndsiRTotal = 0;
  let biophonyLTotal = 0;
  let biophonyRTotal = 0;
  let anthrophonyLTotal = 0;
  let anthrophonyRTotal = 0;

  jobs.forEach(function(job){
    ndsiLTotal += job.result.ndsiL;
    ndsiRTotal += job.result.ndsiR;
    biophonyLTotal += job.result.biophonyL;
    biophonyRTotal += job.result.biophonyR;
    anthrophonyLTotal += job.result.anthrophonyL;
    anthrophonyRTotal += job.result.anthrophonyR;
  });

  let ndsiLAvg = ndsiLTotal / jobs.length;
  let ndsiRAvg = ndsiRTotal / jobs.length;
  let biophonyLAvg = biophonyLTotal / jobs.length;
  let biophonyRAvg = biophonyRTotal / jobs.length;
  let anthrophonyLAvg = anthrophonyLTotal / jobs.length;
  let anthrophonyRAvg = anthrophonyRTotal / jobs.length;

  ret = {
    graph1: {
      data:
      [
        { name: 'Left Channel',
          ndsi: ndsiLAvg,
          biophony: biophonyLAvg,
          anthrophony: anthrophonyLAvg
        },
        { name: 'Right Channel',
          ndsi: ndsiRAvg,
          biophony: biophonyRAvg,
          anthrophony: anthrophonyRAvg
        }
      ],
      title: "NDSI Values"
    },
    graph2: {
      data:
      [
        { name: 'NDSI',
          leftChannel: ndsiLAvg,
          rightChannel: ndsiRAvg
        },
        { name: 'Biophony',
          leftChannel: biophonyLAvg,
          rightChannel: biophonyRAvg
        },
        {
          name: 'Anthrophony',
          leftChannel: anthrophonyLAvg,
          rightChannel: anthrophonyRAvg
        }
      ],
      title: "NDSI By Channel"
    },
    graph4: {
      data: [],
      title: "NDSI By Date and Hour"
    },
    graph5: {
      data: [],
      title: "NDSI By File"
    }
  }

  jobs.forEach(function(job){
    let date = new Date(job.input.recordTimeMs);
    let dayDate = ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2) + '/' + date.getFullYear() + ' ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);

    let curObject;

    curObject =
    {
      name: dayDate,
      ndsiL: job.result.ndsiL,
      ndsiR: job.result.ndsiR,
      biophonyL: job.result.biophonyL,
      biophonyR: job.result.biophonyR,
      anthrophonyL: job.result.anthrophonyL,
      anthrophonyR: job.result.anthrophonyR
    }

    ret.graph4.data.push(curObject);

    curObject = {
      name: job.input.path,
      ndsiL: job.result.ndsiL,
      ndsiR: job.result.ndsiR,
      biophonyL: job.result.biophonyL,
      biophonyR: job.result.biophonyR,
      anthrophonyL: job.result.anthrophonyL,
      anthrophonyR: job.result.anthrophonyR
    }

    ret.graph5.data.push(curObject);

  });

  ret.graph4.data = sortByKey(ret.graph4.data, 'name');
  ret.graph5.data = sortByKey(ret.graph5.data, 'name');

  return ret;
}

export function convertACIResults(jobs) {
  let ret;
  let aciTotAllL = 0;
  let aciTotAllR = 0;
  let aciTotAllByMinL = 0;
  let aciTotAllByMinR = 0;

  let aciFlValsL = [];
  let aciFlValsR = [];

  jobs.forEach(function(job){
    aciTotAllL += job.result.aciTotAllL;
    aciTotAllR += job.result.aciTotAllR;
    aciTotAllByMinL += job.result.aciTotAllByMinL;
    aciTotAllByMinR += job.result.aciTotAllByMinR;

    aciFlValsL.push.apply(aciFlValsL, job.result.aciFlValsL);
    aciFlValsR.push.apply(aciFlValsR, job.result.aciFlValsR);
  });

  ret = {
    graph1:
    {
      data: [],
      title: "ACI By Seconds",
      xAxisLabel: "Time (s)",
      yAxisLabel: "ACI Value",
      dataKey1: 'aciLeft',
      dataKey2: 'aciRight'
    },
    // graph3:
    // {
    //   data: [],
    //   title: "ACI By Hour",
    //   xAxisLabel: "Hour of Day",
    //   yAxisLabel: "ACI Value",
    //   dataKey1: 'aciLeft',
    //   dataKey2: 'aciRight'
    // },
    graph4:
    {
      data: [],
      title: "ACI By Date And Hour",
      xAxisLabel: "Date",
      yAxisLabel: "ACI Value",
      dataKey1: 'aciLeft',
      dataKey2: 'aciRight'
    },
    graph5:
    {
      data: [],
      title: "ACI By File",
      xAxisLabel: "File Name",
      yAxisLabel: "ACI Value",
      dataKey1: 'aciLeft',
      dataKey2: 'aciRight'
    }
  }

  for(var i = 0; i < aciFlValsL.length; i++)
  {
    let curObject =
    {
      name: ((i + 1) * 5).toString(),
      aciLeft: aciFlValsL[i],
      aciRight: aciFlValsR[i]
    }

    ret.graph1.data.push(curObject);
  }

  jobs.forEach(function(job){
    let date = new Date(job.input.recordTimeMs);
    let dayDate = ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2) + '/' + date.getFullYear() + ' ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);

    let curObject;

    curObject =
    {
      name: dayDate,
      aciLeft: job.result.aciTotAllByMinL,
      aciRight: job.result.aciTotAllByMinR
    }

    ret.graph4.data.push(curObject);

    curObject =
    {
      name: job.input.path,
      aciLeft: job.result.aciTotAllByMinL,
      aciRight: job.result.aciTotAllByMinR
    }

    ret.graph5.data.push(curObject);
  });

  ret.graph4.data = sortByKey(ret.graph4.data, 'name');

  return ret;
}

export function convertADIResults(jobs) {

  let ret;

  let arrLength = jobs[0].result.ADIbandValsL.length;
  let adiLTotal = 0;
  let adiRTotal = 0;
  let adiLBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);
  let adiRBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);

  jobs.forEach(function(job){
    adiLTotal += job.result.adiL;
    adiRTotal += job.result.adiR;

    adiLBandTemp = adiLBandTemp.map(function(num, idx){
      return num + job.result.ADIbandValsL[idx];
    });

    adiRBandTemp = adiRBandTemp.map(function(num, idx){
      return num + job.result.ADIbandValsR[idx];
    });

  });

  let adiLAvg = adiLTotal / jobs.length;
  let adiRAvg = adiRTotal / jobs.length;

  let adiLBand = adiLBandTemp.map(function(element){
    return element / jobs.length;
  });

  let adiRBand = adiRBandTemp.map(function(element){
    return element / jobs.length;
  });

  ret = {
    graph1:
    {
      data: [],
      title: "ADI By Band Range",
      xAxisLabel: "Hz Range",
      yAxisLabel: "ADI Value",
      dataKey1: "leftBandVal",
      dataKey2: "rightBandVal",
      refL: adiLAvg,
      refR: adiRAvg,
      refLabel1: "ADI Left",
      refLabel2: "ADI Right",
    },
    graph2:
    {
      data: [],
      title: "ADI By File",
      xAxisLabel: "File Name",
      yAxisLabel: "ADI Value",
      dataKey1: "leftADIVal",
      dataKey2: "rightADIVal",
      refL: adiLAvg,
      refR: adiRAvg,
      refLabel1: "ADI Left",
      refLabel2: "ADI Right",
    },
    graph4:
    {
      data: [],
      title: "ADI By Date And Hour",
      xAxisLabel: "Date",
      yAxisLabel: "ADI Value",
      dataKey1: "leftADIVal",
      dataKey2: "rightADIVal",
      refL: adiLAvg,
      refR: adiRAvg,
      refLabel1: "ADI Left",
      refLabel2: "ADI Right",
    }
  }

  for(var i = 0; i < adiLBand.length; i++)
  {
    let curObject =
    {
      name: jobs[0].result.ADIbandRangeL[i],
      leftBandVal: adiLBand[i],
      rightBandVal: adiRBand[i]
    }

    ret.graph1.data.push(curObject);
  }

  jobs.forEach(function(job){
    let date = new Date(job.input.recordTimeMs);
    let dayDate = ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2) + '/' + date.getFullYear() + ' ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);

    let curObject;

    curObject =
    {
      name: dayDate,
      leftADIVal: job.result.adiL,
      rightADIVal: job.result.adiR
    }

    ret.graph4.data.push(curObject);

    curObject =
    {
      name: job.input.path,
      leftADIVal: job.result.adiL,
      rightADIVal: job.result.adiR
    }

    ret.graph2.data.push(curObject);

  });

  ret.graph4.data = sortByKey(ret.graph4.data, 'name');

  return ret;
}

export function convertAEIResults(jobs) {
  let ret;

  let arrLength = jobs[0].result.AEIbandValsL.length;
  let aeiLTotal = 0;
  let aeiRTotal = 0;
  let aeiLBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);
  let aeiRBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);

  jobs.forEach(function(job){
    aeiLTotal += job.result.aeiL;
    aeiRTotal += job.result.aeiR;

    aeiLBandTemp = aeiLBandTemp.map(function(num, idx){
      return num + job.result.AEIbandValsL[idx];
    });

    aeiRBandTemp = aeiRBandTemp.map(function(num, idx){
      return num + job.result.AEIbandValsR[idx];
    });

  });

  let aeiLAvg = aeiLTotal / jobs.length;
  let aeiRAvg = aeiRTotal / jobs.length;

  let aeiLBand = aeiLBandTemp.map(function(element){
    return element / jobs.length;
  });

  let aeiRBand = aeiRBandTemp.map(function(element){
    return element / jobs.length;
  });

  ret = {
    graph1:
    {
      data: [],
      title: "AEI By Band Range",
      xAxisLabel: "Hz Range",
      yAxisLabel: "AEI Level",
      dataKey1: "leftBandVal",
      dataKey2: "rightBandVal",
      refL: aeiLAvg,
      refR: aeiRAvg,
      refLabel1: "AEI Left",
      refLabel2: "AEI Right"
    },
    graph2:
    {
      data: [],
      title: "AEI By File",
      xAxisLabel: "File Name",
      yAxisLabel: "AEI Level",
      dataKey1: "leftAEIVal",
      dataKey2: "rightAEIVal",
      refL: aeiLAvg,
      refR: aeiRAvg,
      refLabel1: "AEI Left",
      refLabel2: "AEI Right"
    },
    graph4:
    {
      data: [],
      title: "AEI By Date And Hour",
      xAxisLabel: "Date",
      yAxisLabel: "AEI Level",
      dataKey1: "leftAEIVal",
      dataKey2: "rightAEIVal",
      refL: aeiLAvg,
      refR: aeiRAvg,
      refLabel1: "AEI Left",
      refLabel2: "AEI Right"
    }
  }

  for(var i = 0; i < aeiLBand.length; i++)
  {
    let curObject =
    {
      name: jobs[0].result.AEIbandRangeL[i],
      leftBandVal: aeiLBand[i],
      rightBandVal: aeiRBand[i]
    }

    ret.graph1.data.push(curObject);
  }

  jobs.forEach(function(job){
    let date = new Date(job.input.recordTimeMs);
    let dayDate = ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2) + '/' + date.getFullYear() + ' ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);

    let curObject;

    curObject =
    {
      name: dayDate,
      leftAEIVal: job.result.aeiL,
      rightAEIVal: job.result.aeiR
    }

    ret.graph4.data.push(curObject);

    curObject =
    {
      name: job.input.path,
      leftAEIVal: job.result.aeiL,
      rightAEIVal: job.result.aeiR
    }

    ret.graph2.data.push(curObject);

  });

  ret.graph4.data = sortByKey(ret.graph4.data, 'name');

  return ret;
}

export function convertBIResults(jobs) {
  let ret;

  let areaLTotal = 0;
  let areaRTotal = 0;

  jobs.forEach(job => {
    areaLTotal += job.result.areaL;
    areaRTotal += job.result.areaR;
  });

  ret = {
    graph1:
    {
      data: [],
      xAxisLabel: "Hz Range",
      yAxisLabel: "Spectrum Value",
      dataKey1: 'leftSpectrum',
      dataKey2: 'rightSpectrum',
      title: "Bioacoustic Spectrum Values"
    },
    graph3:
    {
      data: [],
      xAxisLabel: "File Name",
      yAxisLabel: "Area Value",
      title: "Bioacoustic Area Value By File"
    },
    graph4:
    {
      data: [],
      xAxisLabel: "Date",
      yAxisLabel: "Area Value",
      title: "Bioacoustic Area Value By Date And Hour"
    }
  }

  for(var i = 0; i < jobs[0].result.freq_vals.length; i++)
  {
    let curObject =
    {
      name: jobs[0].result.freq_vals[i],
      leftSpectrum: jobs[0].result.left_vals[i],
      rightSpectrum: jobs[0].result.right_vals[i]
    }

    ret.graph1.data.push(curObject);
  }

  jobs.forEach(function(job){
    let date = new Date(job.input.recordTimeMs);
    let dayDate = ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2) + '/' + date.getFullYear() + ' ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);

    let curObject;

    curObject =
    {
      name: dayDate,
      areaL: job.result.areaL,
      areaR: job.result.areaR
    }

    ret.graph5.data.push(curObject);

    curObject = {
      name: job.input.path,
      areaL: job.result.areaL,
      areaR: job.result.areaR
    }
    ret.graph3.data.push(curObject);

  });

  ret.graph5.data = sortByKey(ret.graph5.data, 'name');

  return ret;
}

/********** Comparison graph data modeling functions **********/
export function convertACIResultsBySite(jobs, sites) {

  const chosenSiteJobs = jobs.filter(x => x.input.site === sites[0]);
  const compareSiteJobs = jobs.filter(x => x.input.site === sites[1]);

  let chosenResults = convertACIResults(chosenSiteJobs);
  let compareResults = convertACIResults(compareSiteJobs);

  let chosenBySeconds = chosenResults.graph1;
  let chosenByDate = chosenResults.graph4;

  let compareBySeconds = compareResults.graph1;
  let compareByDate = compareResults.graph4;

  // rename keys in compare data
  compareBySeconds.data.forEach(item => {
    item['aciLeftC'] = item['aciLeft'];
    item['aciRightC'] = item['aciRight'];
    delete(item['aciLeft']);
    delete(item['aciRight']);
  });

  compareByDate.data.forEach(item => {
    item['aciLeftC'] = item['aciLeft'];
    item['aciRightC'] = item['aciRight'];
    delete(item['aciLeft']);
    delete(item['aciRight']);
  });

  let secondsData = chosenBySeconds.data.concat(compareBySeconds.data);
  let dateData = chosenByDate.data.concat(compareByDate.data);

  secondsData = sortByKey(secondsData, 'name');
  dateData = sortByKey(dateData, 'name');

  let compressedSecondsData = mergeLikeNames(secondsData);
  let compressedDateData = mergeLikeNames(dateData);

  let ret = {
    graph1: {
      data: compressedSecondsData,
      title: "Compared Over Seconds",
      xAxisLabel: "Time (s)",
      yAxisLabel: "ACI Value",
      dataKey1: 'aciLeft',
      dataKey2: 'aciRight',
      dataKey3: 'aciLeftC',
      dataKey4: 'aciRightC'
    },
    graph3: {
      data: compressedDateData,
      title: "Compared Date",
      xAxisLabel: "Date",
      yAxisLabel: "ACI Value",
      dataKey1: 'aciLeft',
      dataKey2: 'aciRight',
      dataKey3: 'aciLeftC',
      dataKey4: 'aciRightC'
    }
  }

  return ret;
}

export function convertACIResultsBySeries(jobs, series) {

  const chosenSeriesJobs = jobs.filter(x => x.input.series === series[0]);
  const compareSeriesJobs = jobs.filter(x => x.input.series === series[1]);

  let chosenResults = convertACIResults(chosenSeriesJobs);
  let compareResults = convertACIResults(compareSeriesJobs);

  let chosenBySeconds = chosenResults.graph1;
  let chosenByDate = chosenResults.graph4;

  let compareBySeconds = compareResults.graph1;
  let compareByDate = compareResults.graph4;

  // rename keys in compare data
  compareBySeconds.data.forEach(item => {
    item['aciLeftC'] = item['aciLeft'];
    item['aciRightC'] = item['aciRight'];
    delete(item['aciLeft']);
    delete(item['aciRight']);
  });

  compareByDate.data.forEach(item => {
    item['aciLeftC'] = item['aciLeft'];
    item['aciRightC'] = item['aciRight'];
    delete(item['aciLeft']);
    delete(item['aciRight']);
  });

  let secondsData = chosenBySeconds.data.concat(compareBySeconds.data);
  let dateData = chosenByDate.data.concat(compareByDate.data);

  secondsData = sortByKey(secondsData, 'name');
  dateData = sortByKey(dateData, 'name');

  let compressedSecondsData = mergeLikeNames(secondsData);
  let compressedDateData = mergeLikeNames(dateData);

  let ret = {
    graph1: {
      data: compressedSecondsData,
      title: "Compared Over Seconds",
      xAxisLabel: "Time (s)",
      yAxisLabel: "ACI Value",
      dataKey1: 'aciLeft',
      dataKey2: 'aciRight',
      dataKey3: 'aciLeftC',
      dataKey4: 'aciRightC'
    },
    graph3: {
      data: compressedDateData,
      title: "Compared By Date",
      xAxisLabel: "Date",
      yAxisLabel: "ACI Value",
      dataKey1: 'aciLeft',
      dataKey2: 'aciRight',
      dataKey3: 'aciLeftC',
      dataKey4: 'aciRightC'
    }
  }

  return ret;
}

export function convertNDSIResultsBySite(jobs, sites) {
  const chosenSiteJobs = jobs.filter(x => x.input.site === sites[0]);
  const compareSiteJobs = jobs.filter(x => x.input.site === sites[1]);

  let chosenResults = convertNDSIResults(chosenSiteJobs);
  let compareResults = convertNDSIResults(compareSiteJobs);

  let chosenChannels = chosenResults.graph1;
  let chosenValues = chosenResults.graph2;

  let compareChannels = compareResults.graph1;
  let compareValues = compareResults.graph2;

  // rename keys in compare data
  compareChannels.data.forEach(item => {
    item['anthrophonyC'] = item['anthrophony'];
    item['biophonyC'] = item['biophony'];
    item['ndsiC'] = item['ndsi'];
    delete(item['anthrophony']);
    delete(item['biophony']);
    delete(item['ndsi']);
  });

  compareValues.data.forEach(item => {
    item['leftChannelC'] = item['leftChannel'];
    item['rightChannelC'] = item['rightChannel'];
    delete(item['leftChannel']);
    delete(item['rightChannel']);
  });

  let channelsData = chosenChannels.data.concat(compareChannels.data);
  let valuesData = chosenValues.data.concat(compareValues.data);

  channelsData = sortByKey(channelsData, 'name');
  valuesData = sortByKey(valuesData, 'name');

  let compressedChannelsData = mergeLikeNames(channelsData);
  let compressedValuesData = mergeLikeNames(valuesData);

  let ret = {
    graph1: {
      data: compressedChannelsData,
      title: "Compared By Channels",
    },
    graph2: {
      data: compressedValuesData,
      title: "Compared By Values",
    }
  }

  return ret;
}

export function convertNDSIResultsBySeries(jobs, series) {

  const chosenSeriesJobs = jobs.filter(x => x.input.series === series[0]);
  const compareSeriesJobs = jobs.filter(x => x.input.series === series[1]);

  let chosenResults = convertNDSIResults(chosenSeriesJobs);
  let compareResults = convertNDSIResults(compareSeriesJobs);

  let chosenChannels = chosenResults.graph1;
  let chosenValues = chosenResults.graph2;

  let compareChannels = compareResults.graph1;
  let compareValues = compareResults.graph2;

  // rename keys in compare data
  compareChannels.data.forEach(item => {
    item['anthrophonyC'] = item['anthrophony'];
    item['biophonyC'] = item['biophony'];
    item['ndsiC'] = item['ndsi'];
    delete(item['anthrophony']);
    delete(item['biophony']);
    delete(item['ndsi']);
  });

  compareValues.data.forEach(item => {
    item['leftChannelC'] = item['leftChannel'];
    item['rightChannelC'] = item['rightChannel'];
    delete(item['leftChannel']);
    delete(item['rightChannel']);
  });

  let channelsData = chosenChannels.data.concat(compareChannels.data);
  let valuesData = chosenValues.data.concat(compareValues.data);

  channelsData = sortByKey(channelsData, 'name');
  valuesData = sortByKey(valuesData, 'name');

  let compressedChannelsData = mergeLikeNames(channelsData);
  let compressedValuesData = mergeLikeNames(valuesData);

  let ret = {
    graph1: {
      data: compressedChannelsData,
      title: "Compared By Channels",
    },
    graph2: {
      data: compressedValuesData,
      title: "Compared By Values",
    }
  }

  return ret;
}

export function convertBIResultsBySite(jobs, sites) {

  const chosenSiteJobs = jobs.filter(x => x.input.site === sites[0]);
  const compareSiteJobs = jobs.filter(x => x.input.site === sites[1]);

  let chosenResults = convertBIResults(chosenSiteJobs);
  let compareResults = convertBIResults(compareSiteJobs);

  let chosenSpectrumValues = chosenResults.graph1;
  let chosenByDate = chosenResults.graph4;

  let compareSpectrumValues = compareResults.graph1;
  let compareByDate = compareResults.graph4;

  // rename keys in compare data
  compareSpectrumValues.data.forEach(item => {
    item['leftSpectrumC'] = item['leftSpectrum'];
    item['rightSpectrumC'] = item['rightSpectrum'];
    delete(item['leftSpectrum']);
    delete(item['rightSpectrum']);
  });

  compareByDate.data.forEach(item => {
    item['areaLC'] = item['areaL'];
    item['areaRC'] = item['areaR'];
    delete(item['areaL']);
    delete(item['areaR']);
  });

  let spectrumData = chosenSpectrumValues.data.concat(compareSpectrumValues.data);
  let dateData = chosenByDate.data.concat(compareByDate.data);

  spectrumData = sortByKey(spectrumData, 'name');
  dateData = sortByKey(dateData, 'name');

  let compressedSpectrumData = mergeLikeNames(spectrumData);
  let compressedDateData = mergeLikeNames(dateData);

  let ret = {
    graph1: {
      data: compressedSpectrumData,
      title: "Compared By Spectrum Values",
      xAxisLabel: "Hz Range",
      yAxisLabel: "Spectrum Value",
      dataKey1: 'leftSpectrum',
      dataKey2: 'rightSpectrum',
      dataKey3: 'leftSpectrumC',
      dataKey4: 'rightSpectrumC'
    },
    graph3: {
      data: compressedDateData,
      title: "Compared By Date",
      xAxisLabel: "Date",
      yAxisLabel: "Bioacoustic Area Value",
      dataKey1: 'areaL',
      dataKey2: 'areaR',
      dataKey3: 'areaLC',
      dataKey4: 'areaRC'
    }
  }

  return ret;
}

export function convertBIResultsBySeries(jobs, series) {

  const chosenSeriesJobs = jobs.filter(x => x.input.series === series[0]);
  const compareSeriesJobs = jobs.filter(x => x.input.series === series[1]);

  let chosenResults = convertBIResults(chosenSeriesJobs);
  let compareResults = convertBIResults(compareSeriesJobs);

  let chosenSpectrumValues = chosenResults.graph1;
  let chosenByDate = chosenResults.graph4;

  let compareSpectrumValues = compareResults.graph1;
  let compareByDate = compareResults.graph4;

  // rename keys in compare data
  compareSpectrumValues.data.forEach(item => {
    item['leftSpectrumC'] = item['leftSpectrum'];
    item['rightSpectrumC'] = item['rightSpectrum'];
    delete(item['leftSpectrum']);
    delete(item['rightSpectrum']);
  });

  compareByDate.data.forEach(item => {
    item['areaLC'] = item['areaL'];
    item['areaRC'] = item['areaR'];
    delete(item['areaL']);
    delete(item['areaR']);
  });

  let spectrumData = chosenSpectrumValues.data.concat(compareSpectrumValues.data);
  let dateData = chosenByDate.data.concat(compareByDate.data);

  spectrumData = sortByKey(spectrumData, 'name');
  dateData = sortByKey(dateData, 'name');

  let compressedSpectrumData = mergeLikeNames(spectrumData);
  let compressedDateData = mergeLikeNames(dateData);

  let ret = {
    graph1: {
      data: compressedSpectrumData,
      title: "Compared By Spectrum Values",
      xAxisLabel: "Hz Range",
      yAxisLabel: "Spectrum Value",
      dataKey1: 'leftSpectrum',
      dataKey2: 'rightSpectrum',
      dataKey3: 'leftSpectrumC',
      dataKey4: 'rightSpectrumC'
    },
    graph3: {
      data: compressedDateData,
      title: "Compared By Date",
      xAxisLabel: "Date",
      yAxisLabel: "Bioacoustic Area Value",
    }
  }

  return ret;
}

export function convertADIResultsBySite(jobs, sites) {

  const chosenSiteJobs = jobs.filter(x => x.input.site === sites[0]);
  const compareSiteJobs = jobs.filter(x => x.input.site === sites[1]);

  let chosenResults = convertADIResults(chosenSiteJobs);
  let compareResults = convertADIResults(compareSiteJobs);

  let chosenBandValues = chosenResults.graph1;
  let chosenByDate = chosenResults.graph4;

  let compareBandValues = compareResults.graph1;
  let compareByDate = compareResults.graph4;

  let refL = chosenByDate.refL;
  let refR = chosenByDate.refR;
  let refLC = chosenByDate.refL;
  let refRC = chosenByDate.refR;

  // rename keys in compare data
  compareBandValues.data.forEach(item => {
    item['leftBandValC'] = item['leftBandVal'];
    item['rightBandValC'] = item['rightBandVal'];
    delete(item['leftBandVal']);
    delete(item['rightBandVal']);
  });

  compareByDate.data.forEach(item => {
    item['leftADIValC'] = item['leftADIVal'];
    item['rightADIValC'] = item['rightADIVal'];
    delete(item['leftADIVal']);
    delete(item['rightADIVal']);
  });

  let bandData = chosenBandValues.data.concat(compareBandValues.data);
  let dateData = chosenByDate.data.concat(compareByDate.data);

  bandData = sortByKey(bandData, 'name');
  dateData = sortByKey(dateData, 'name');

  let compressedBandData = mergeLikeNames(bandData);
  let compressedDateData = mergeLikeNames(dateData);

  let ret = {
    graph1: {
      data: compressedBandData,
      title: "Compared By Band Values",
      xAxisLabel: "Hz Range",
      yAxisLabel: "ADI Value",
      dataKey1: "leftBandVal",
      dataKey2: "rightBandVal",
      dataKey3: "leftBandValC",
      dataKey4: "rightBandValC",
      refL: refL,
      refR: refR,
      refLC: refLC,
      refRC: refRC,
      refLabel1: "ADI Left",
      refLabel2: "ADI Right",
      refLabel3: "ADI Left Compare",
      refLabel4: "ADI Right Compare"
    },
    graph3: {
      data: compressedDateData,
      title: "Compared By Date",
      xAxisLabel: "Date",
      yAxisLabel: "ADI Value",
      dataKey1: "leftADIVal",
      dataKey2: "rightADIVal",
      dataKey3: "leftADIValC",
      dataKey4: "rightADIValC",
      refL: refL,
      refR: refR,
      refLC: refLC,
      refRC: refRC,
      refLabel1: "ADI Left",
      refLabel2: "ADI Right",
      refLabel3: "ADI Left Compare",
      refLabel4: "ADI Right Compare"
    }
  }

  return ret;
}

export function convertADIResultsBySeries(jobs, series) {

  const chosenSeriesJobs = jobs.filter(x => x.input.series === series[0]);
  const compareSeriesJobs = jobs.filter(x => x.input.series === series[1]);

  let chosenResults = convertADIResults(chosenSeriesJobs);
  let compareResults = convertADIResults(compareSeriesJobs);

  let chosenBandValues = chosenResults.graph1;
  let chosenByDate = chosenResults.graph4;

  let compareBandValues = compareResults.graph1;
  let compareByDate = compareResults.graph4;

  let refL = chosenByDate.refL;
  let refR = chosenByDate.refR;
  let refLC = chosenByDate.refL;
  let refRC = chosenByDate.refR;

  // rename keys in compare data
  compareBandValues.data.forEach(item => {
    item['leftBandValC'] = item['leftBandVal'];
    item['rightBandValC'] = item['rightBandVal'];
    delete(item['leftBandVal']);
    delete(item['rightBandVal']);
  });

  compareByDate.data.forEach(item => {
    item['leftADIValC'] = item['leftADIVal'];
    item['rightADIValC'] = item['rightADIVal'];
    delete(item['leftADIVal']);
    delete(item['rightADIVal']);
  });

  let bandData = chosenBandValues.data.concat(compareBandValues.data);
  let dateData = chosenByDate.data.concat(compareByDate.data);

  bandData = sortByKey(bandData, 'name');
  dateData = sortByKey(dateData, 'name');

  let compressedBandData = mergeLikeNames(bandData);
  let compressedDateData = mergeLikeNames(dateData);

  let ret = {
    graph1: {
      data: compressedBandData,
      title: "Compared By Band Values",
      xAxisLabel: "Hz Range",
      yAxisLabel: "ADI Value",
      dataKey1: "leftBandVal",
      dataKey2: "rightBandVal",
      dataKey3: "leftBandValC",
      dataKey4: "rightBandValC",
      refL: refL,
      refR: refR,
      refLC: refLC,
      refRC: refRC,
      refLabel1: "ADI Left",
      refLabel2: "ADI Right",
      refLabel3: "ADI Left Compare",
      refLabel4: "ADI Right Compare"
    },
    graph3: {
      data: compressedDateData,
      title: "Compared By Date",
      xAxisLabel: "Date",
      yAxisLabel: "ADI Value",
      dataKey1: "leftADIVal",
      dataKey2: "rightADIVal",
      dataKey3: "leftADIValC",
      dataKey4: "rightADIValC",
      refL: refL,
      refR: refR,
      refLC: refLC,
      refRC: refRC,
      refLabel1: "ADI Left",
      refLabel2: "ADI Right",
      refLabel3: "ADI Left Compare",
      refLabel4: "ADI Right Compare"
    }
  }

  return ret;
}

export function convertAEIResultsBySite(jobs, sites) {

  const chosenSiteJobs = jobs.filter(x => x.input.site === sites[0]);
  const compareSiteJobs = jobs.filter(x => x.input.site === sites[1]);

  let chosenResults = convertAEIResults(chosenSiteJobs);
  let compareResults = convertAEIResults(compareSiteJobs);

  let chosenBandValues = chosenResults.graph1;
  let chosenByDate = chosenResults.graph4;

  let compareBandValues = compareResults.graph1;
  let compareByDate = compareResults.graph4;

  let refL = chosenByDate.refL;
  let refR = chosenByDate.refR;
  let refLC = chosenByDate.refL;
  let refRC = chosenByDate.refR;

  // rename keys in compare data
  compareBandValues.data.forEach(item => {
    item['leftBandValC'] = item['leftBandVal'];
    item['rightBandValC'] = item['rightBandVal'];
    delete(item['leftBandVal']);
    delete(item['rightBandVal']);
  });

  compareByDate.data.forEach(item => {
    item['leftAEIValC'] = item['leftAEIVal'];
    item['rightAEIValC'] = item['rightAEIVal'];
    delete(item['leftAEIVal']);
    delete(item['rightAEIVal']);
  });

  let bandData = chosenBandValues.data.concat(compareBandValues.data);
  let dateData = chosenByDate.data.concat(compareByDate.data);

  bandData = sortByKey(bandData, 'name');
  dateData = sortByKey(dateData, 'name');

  let compressedBandData = mergeLikeNames(bandData);
  let compressedDateData = mergeLikeNames(dateData);

  let ret = {
    graph1: {
      data: compressedBandData,
      title: "Compared By Band Values",
      xAxisLabel: "Hz Range",
      yAxisLabel: "AEI Value",
      dataKey1: "leftBandVal",
      dataKey2: "rightBandVal",
      dataKey3: "leftBandValC",
      dataKey4: "rightBandValC",
      refL: refL,
      refR: refR,
      refLC: refLC,
      refRC: refRC,
      refLabel1: "AEI Left",
      refLabel2: "AEI Right",
      refLabel3: "AEI Left Compare",
      refLabel4: "AEI Right Compare"
    },
    graph3: {
      data: compressedDateData,
      title: "Compared By Date",
      xAxisLabel: "Date",
      yAxisLabel: "AEI Value",
      dataKey1: "leftAEIVal",
      dataKey2: "rightAEIVal",
      dataKey3: "leftAEIValC",
      dataKey4: "rightAEIValC",
      refL: refL,
      refR: refR,
      refLC: refLC,
      refRC: refRC,
      refLabel1: "AEI Left",
      refLabel2: "AEI Right",
      refLabel3: "AEI Left Compare",
      refLabel4: "AEI Right Compare"
    }
  }

  return ret;
}

export function convertAEIResultsBySeries(jobs, series) {

    const chosenSeriesJobs = jobs.filter(x => x.input.series === series[0]);
    const compareSeriesJobs = jobs.filter(x => x.input.series === series[1]);

    let chosenResults = convertAEIResults(chosenSeriesJobs);
    let compareResults = convertAEIResults(compareSeriesJobs);

    let chosenBandValues = chosenResults.graph1;
    let chosenByDate = chosenResults.graph4;

    let compareBandValues = compareResults.graph1;
    let compareByDate = compareResults.graph4;

    let refL = chosenByDate.refL;
    let refR = chosenByDate.refR;
    let refLC = chosenByDate.refL;
    let refRC = chosenByDate.refR;

    // rename keys in compare data
    compareBandValues.data.forEach(item => {
      item['leftBandValC'] = item['leftBandVal'];
      item['rightBandValC'] = item['rightBandVal'];
      delete(item['leftBandVal']);
      delete(item['rightBandVal']);
    });

    compareByDate.data.forEach(item => {
      item['leftAEIValC'] = item['leftAEIVal'];
      item['rightAEIValC'] = item['rightAEIVal'];
      delete(item['leftAEIVal']);
      delete(item['rightAEIVal']);
    });

    let bandData = chosenBandValues.data.concat(compareBandValues.data);
    let dateData = chosenByDate.data.concat(compareByDate.data);

    bandData = sortByKey(bandData, 'name');
    dateData = sortByKey(dateData, 'name');

    let compressedBandData = mergeLikeNames(bandData);
    let compressedDateData = mergeLikeNames(dateData);

    let ret = {
      graph1: {
        data: compressedBandData,
        title: "Compared By Band Values",
        xAxisLabel: "Hz Range",
        yAxisLabel: "AEI Value",
        dataKey1: "leftBandVal",
        dataKey2: "rightBandVal",
        dataKey3: "leftBandValC",
        dataKey4: "rightBandValC",
        refL: refL,
        refR: refR,
        refLC: refLC,
        refRC: refRC,
        refLabel1: "AEI Left",
        refLabel2: "AEI Right",
        refLabel3: "AEI Left Compare",
        refLabel4: "AEI Right Compare"
      },
      graph3: {
        data: compressedDateData,
        title: "Compared By Date",
        xAxisLabel: "Date",
        yAxisLabel: "AEI Value",
        dataKey1: "leftAEIVal",
        dataKey2: "rightAEIVal",
        dataKey3: "leftAEIValC",
        dataKey4: "rightAEIValC",
        refL: refL,
        refR: refR,
        refLC: refLC,
        refRC: refRC,
        refLabel1: "AEI Left",
        refLabel2: "AEI Right",
        refLabel3: "AEI Left Compare",
        refLabel4: "AEI Right Compare"
      }
    }

    return ret;
}