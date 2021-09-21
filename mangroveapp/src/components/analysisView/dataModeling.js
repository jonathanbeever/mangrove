import SoundTypes from '../../constants/analysis/soundTypes';

/********** Core helper functions **********/
export function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

export function sortByKeys(array, key1, key2) {
    return array.sort(function(a, b) {
        var x = a[key1][key2]; var y = b[key1][key2];
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
export function convertRMSResults(jobs) {
  let finished = jobs.filter(x => x.status === "finished");
  let ret = {
    graph1: {
      data: [],
      avgL: 0,
      avgR: 0,
      title: "RMS By File"
    }
  }

  let avgL = 0;
  let avgR = 0;

  let curObject = {};
  finished.forEach(job => {
    avgL += job.result.rmsL;
    avgR += job.result.rmsR;

    curObject = {
      name: job.input.name,
      rmsL: job.result.rmsL,
      rmsR: job.result.rmsR
    }

    ret.graph1.data.push(curObject);
  });

  let len = finished.length;
  ret.graph1.avgL = avgL / len;
  ret.graph1.avgR = avgR / len;

  return ret;
}

export function convertNDSIResults(jobs) {
  let finished = jobs.filter(x => x.status === "finished");
  let ret;

  let ndsiLTotal = 0;
  let ndsiRTotal = 0;
  let biophonyLTotal = 0;
  let biophonyRTotal = 0;
  let anthrophonyLTotal = 0;
  let anthrophonyRTotal = 0;

  finished.forEach(function(job){
    ndsiLTotal += job.result.ndsiL;
    ndsiRTotal += job.result.ndsiR;
    biophonyLTotal += job.result.biophonyL;
    biophonyRTotal += job.result.biophonyR;
    anthrophonyLTotal += job.result.anthrophonyL;
    anthrophonyRTotal += job.result.anthrophonyR;
  });

  let ndsiLAvg = ndsiLTotal / finished.length;
  let ndsiRAvg = ndsiRTotal / finished.length;
  let biophonyLAvg = biophonyLTotal / finished.length;
  let biophonyRAvg = biophonyRTotal / finished.length;
  let anthrophonyLAvg = anthrophonyLTotal / finished.length;
  let anthrophonyRAvg = anthrophonyRTotal / finished.length;

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
      title: "NDSI Values By File"
    }
  }

  finished.forEach(function(job){
    let date = new Date(job.input.recordTimeMs);
    let dayDate = ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2) + '/' + date.getFullYear() + ' ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);

    let curObject;

    curObject =
    {
      name: dayDate,
      ndsi: (job.result.ndsiL + job.result.ndsiR) / 2,
      biophony: (job.result.biophonyL + job.result.biophonyR) / 2,
      anthrophony: (job.result.anthrophonyL + job.result.anthrophonyR) / 2,
      jobId: job.jobId,
      inputId: job.input.inputId
    }

    ret.graph4.data.push(curObject);

    curObject = {
      name: job.input.name,
      downloadUrl: job.input.downloadUrl,
      ndsiL: job.result.ndsiL,
      ndsiR: job.result.ndsiR,
      biophonyL: job.result.biophonyL,
      biophonyR: job.result.biophonyR,
      anthrophonyL: job.result.anthrophonyL,
      anthrophonyR: job.result.anthrophonyR,
      jobId: job.jobId,
      inputId: job.input.inputId
    }

    ret.graph5.data.push(curObject);

  });

  ret.graph4.data = sortByKey(ret.graph4.data, 'name');
  ret.graph5.data = sortByKey(ret.graph5.data, 'name');

  return ret;
}

export function convertACIResults(jobs) {
  let finished = jobs.filter(x => x.status === "finished");
  let ret;

  ret = {
    graph1:
    {
      data: [],
      title: "ACI By Seconds Per File",
      xAxisLabel: "File Name",
      yAxisLabel: "ACI",
      dataKey1: 'aciLeft',
      dataKey2: 'aciRight'
    },
    graph2:
    {
      data: [],
      title: "ACI Total Value Divided By Minutes",
    },
    graph3:
    {
      data: [],
      title: "ACI By Band Range",
      xAxisLabel: "Band Range",
      yAxisLabel: "ACI",
      dataKey1: 'aciLeft',
      dataKey2: 'aciRight'
    },
    graph4:
    {
      data: [],
      title: "ACI By Date And Hour",
      xAxisLabel: "Date",
      yAxisLabel: "ACI",
      dataKey1: 'aciLeft',
      dataKey2: 'aciRight'
    },
    graph5:
    {
      data: [],
      title: "ACI By File",
      xAxisLabel: "File Name",
      yAxisLabel: "ACI",
      dataKey1: 'aciLeft',
      dataKey2: 'aciRight'
    }
  }

  finished.forEach(function(job){
    let date = new Date(job.input.recordTimeMs);
    let dayDate = ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2) + '/' + date.getFullYear() + ' ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
    let curObject;

    let j = job.spec.j;
    let inputLen = job.result.aciOverTimeL.length;
    let stamp = j;
    if(inputLen === undefined)
    {
      curObject =
      {
        name: job.input.name,
        stamp: stamp,
        downloadUrl: job.input.downloadUrl,
        aciLeft: job.result.aciOverTimeL,
        aciRight: job.result.aciOverTimeR,
        jobId: job.jobId,
        inputId: job.input.inputId
      }

      ret.graph1.data.push(curObject);
    }else
    {
      for(var i = 0; i < inputLen; i++)
      {
        curObject =
        {
          name: job.input.name,
          stamp: stamp,
          downloadUrl: job.input.downloadUrl,
          aciLeft: job.result.aciOverTimeL[i],
          aciRight: job.result.aciOverTimeR[i],
          jobId: job.jobId,
          inputId: job.input.inputId
        }

        ret.graph1.data.push(curObject);

        stamp += j;
      }
    }

    curObject =
    {
      name: job.input.name,
      aciTotAllByMinL: job.result.aciTotAllByMinL,
      aciTotAllByMinR: job.result.aciTotAllByMinR,
      jobId: job.jobId,
      inputId: job.input.inputId
    }

    ret.graph2.data.push(curObject);

    let maxFreq;
    if(job.spec.maxFreq === "nyquist") maxFreq = job.input.sampleRateHz / 2;
    else maxFreq = job.spec.maxFreq;
    let minFreq = job.spec.minFreq;
    let entries = job.result.aciFlValsL.length;
    let step = Math.floor((maxFreq - minFreq) / entries);
    let indx = 0;
    let last = minFreq;
    for(i = minFreq+step; i <= maxFreq; i += step)
    {
      curObject =
      {
        name: last + "-" + i + "Hz",
        fileName: job.input.name,
        aciLeft: job.result.aciFlValsL[indx],
        aciRight: job.result.aciFlValsR[indx],
        jobId: job.jobId,
        inputId: job.input.inputId
      }

      ret.graph3.data.push(curObject);
      indx++;
      last = i;
    }

    curObject =
    {
      name: dayDate,
      aciLeft: job.result.aciTotAllByMinL,
      aciRight: job.result.aciTotAllByMinR,
      jobId: job.jobId,
      inputId: job.input.inputId
    }

    ret.graph4.data.push(curObject);

    curObject =
    {
      name: job.input.name,
      aciLeft: job.result.aciTotAllByMinL,
      aciRight: job.result.aciTotAllByMinR,
      jobId: job.jobId,
      inputId: job.input.inputId
    }

    ret.graph5.data.push(curObject);
  });

  ret.graph4.data = sortByKey(ret.graph4.data, 'name');
  return ret;
}

export function convertADIResults(jobs) {
  let finished = jobs.filter(x => x.status === "finished");
  let ret;

  let arrLength;
  let jobIds = [];

  if(finished.length === 0) arrLength = 0;
  else arrLength = finished[0].result.bandL.length;

  let adiLTotal = 0;
  let adiRTotal = 0;
  let adiLBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);
  let adiRBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);

  finished.forEach(function(job){
    adiLTotal += job.result.adiL;
    adiRTotal += job.result.adiR;

    jobIds.push(job.jobId);

    adiLBandTemp = adiLBandTemp.map(function(num, idx){
      return num + job.result.bandL[idx];
    });

    adiRBandTemp = adiRBandTemp.map(function(num, idx){
      return num + job.result.bandR[idx];
    });

  });

  let denom = finished.length > 0 ? finished.length : 1;
  let adiLAvg = adiLTotal / denom;
  let adiRAvg = adiRTotal / denom;

  let adiLBand = adiLBandTemp.map(function(element){
    return element / denom;
  });

  let adiRBand = adiRBandTemp.map(function(element){
    return element / denom;
  });

  ret = {
    graph1:
    {
      data: [],
      title: "ADI Value By Band Range",
      xAxisLabel: "Hz Range",
      yAxisLabel: "ADI",
      dataKey1: "leftBandVal",
      dataKey2: "rightBandVal",
      left: adiLAvg,
      right: adiRAvg
    },
    fileData:
    {
      title: "File Data",
      files: {},
      fileNames: [],
    },
    graph2:
    {
      data: [],
      title: "ADI Average By File",
      xAxisLabel: "File Name",
      yAxisLabel: "ADI",
      dataKey1: "leftADIVal",
      dataKey2: "rightADIVal",
      left: adiLAvg,
      right: adiRAvg
    },
    graph4:
    {
      data: [],
      title: "ADI Average By Date And Hour",
      xAxisLabel: "Date",
      yAxisLabel: "ADI",
      dataKey1: "leftADIVal",
      dataKey2: "rightADIVal",
      left: adiLAvg,
      right: adiRAvg
    }
  }

  for(var i = 0; i < arrLength; i++)
  {
    let curObject =
    {
      name: finished[0].result.bandRangeL[i],
      leftBandVal: adiLBand[i],
      rightBandVal: adiRBand[i],
      jobIds
    }

    ret.graph1.data.push(curObject);
  }

  finished.forEach(function(job){
    let date = new Date(job.input.recordTimeMs);
    let dayDate = ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2) + '/' + date.getFullYear() + ' ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);

    let curObject;

    ret.fileData.files[job.input.name] = job.result;
    ret.fileData.fileNames.push(job.input.name);

    curObject =
    {
      name: dayDate,
      leftADIVal: job.result.adiL,
      rightADIVal: job.result.adiR,
      jobId: job.jobId
    }

    ret.graph4.data.push(curObject);

    curObject =
    {
      name: job.input.name,
      leftADIVal: job.result.adiL,
      rightADIVal: job.result.adiR,
      jobId: job.jobId
    }

    ret.graph2.data.push(curObject);

  });

  ret.graph4.data = sortByKey(ret.graph4.data, 'name');

  return ret;
}

export function convertAEIResults(jobs) {
  let finished = jobs.filter(x => x.status === "finished");

  let ret;

  let arrLength;
  let jobIds = [];

  if(finished.length === 0) arrLength = 0;
  else arrLength = finished[0].result.bandL.length;

  let aeiLTotal = 0;
  let aeiRTotal = 0;
  let aeiLBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);
  let aeiRBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);

  finished.forEach(function(job){
    aeiLTotal += job.result.aeiL;
    aeiRTotal += job.result.aeiR;

    jobIds.push(job.jobId);

    aeiLBandTemp = aeiLBandTemp.map(function(num, idx){
      return num + job.result.bandL[idx];
    });

    aeiRBandTemp = aeiRBandTemp.map(function(num, idx){
      return num + job.result.bandR[idx];
    });
  });

  let denom = finished.length > 0 ? finished.length : 1;

  let aeiLAvg = aeiLTotal / denom;
  let aeiRAvg = aeiRTotal / denom;

  let aeiLBand = aeiLBandTemp.map(function(element){
    return element / denom;
  });

  let aeiRBand = aeiRBandTemp.map(function(element){
    return element / denom;
  });

  ret = {
    graph1:
    {
      data: [],
      title: "AEI By Band Range",
      xAxisLabel: "Hz Range",
      yAxisLabel: "AEI",
      dataKey1: "leftBandVal",
      dataKey2: "rightBandVal",
      left: aeiLAvg,
      right: aeiRAvg,
    },
    fileData:
    {
      title: "File Data",
      files: {},
      fileNames: [],
    },
    graph2:
    {
      data: [],
      title: "AEI By File",
      xAxisLabel: "File Name",
      yAxisLabel: "AEI",
      dataKey1: "leftAEIVal",
      dataKey2: "rightAEIVal",
      left: aeiLAvg,
      right: aeiRAvg,
    },
    graph4:
    {
      data: [],
      title: "AEI By Date And Hour",
      xAxisLabel: "Date",
      yAxisLabel: "AEI",
      dataKey1: "leftAEIVal",
      dataKey2: "rightAEIVal",
      left: aeiLAvg,
      right: aeiRAvg,
    }
  }

  for(var i = 0; i < aeiLBand.length; i++) {
    const curObject = {
      name: finished[0].result.bandRangeL[i],
      leftBandVal: aeiLBand[i],
      rightBandVal: aeiRBand[i],
      jobIds: jobIds
    }

    ret.graph1.data.push(curObject);
  }

  finished.forEach(function(job){
    let date = new Date(job.input.recordTimeMs);
    let dayDate = ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2) + '/' + date.getFullYear() + ' ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);

    let curObject;

    ret.fileData.files[job.input.name] = job.result;
    ret.fileData.fileNames.push(job.input.name);

    curObject =
    {
      name: dayDate,
      leftAEIVal: job.result.aeiL,
      rightAEIVal: job.result.aeiR,
      jobId: job.jobId,
      inputId: job.input.inputId
    }

    ret.graph4.data.push(curObject);

    curObject =
    {
      name: job.input.name,
      leftAEIVal: job.result.aeiL,
      rightAEIVal: job.result.aeiR,
      jobId: job.jobId,
      inputId: job.input.inputId
    }

    ret.graph2.data.push(curObject);

  });

  ret.graph4.data = sortByKey(ret.graph4.data, 'name');
  return ret;
}

export function convertBIResults(jobs) {
  let finished = jobs.filter(x => x.status === "finished");
  let ret;

  ret = {
    fileData:
    {
      title: "File Data",
      files: {},
      fileNames: [],
    },
    graph1:
    {
      data: [],
      xAxisLabel: "Hz Range",
      yAxisLabel: "Normalized Spectrum",
      dataKey1: 'leftSpectrum',
      dataKey2: 'rightSpectrum',
      title: "Bioacoustic Spectrum Values"
    },
    graph3:
    {
      data: [],
      xAxisLabel: "File Name",
      yAxisLabel: "Area",
      title: "Bioacoustic Area Value By File"
    },
    graph4:
    {
      data: [],
      xAxisLabel: "Date",
      yAxisLabel: "Area",
      title: "Bioacoustic Area Value By Date And Hour"
    }
  }

  if (finished.length > 0) {
    for(var i = 0; i < finished[0].result.freqVals.length; i++)
    {
      let curObject =
      {
        name: finished[0].result.freqVals[i],
        leftSpectrum: finished[0].result.valsNormalizedL[i],
        rightSpectrum: finished[0].result.valsNormalizedR[i],
        jobId: finished[0].jobId,
        inputId: finished[0].input.inputId
      }

      ret.graph1.data.push(curObject);
    }
  }

  finished.forEach(function(job){
    let date = new Date(job.input.recordTimeMs);
    let dayDate = ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2) + '/' + date.getFullYear() + ' ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);

    let curObject;

    ret.fileData.files[job.input.name] = job.result;
    ret.fileData.fileNames.push(job.input.name);

    curObject =
    {
      name: dayDate,
      areaL: job.result.areaL,
      areaR: job.result.areaR,
      jobId: job.jobId,
      inputId: job.input.inputId
    }

    ret.graph4.data.push(curObject);

    curObject = {
      name: job.input.name,
      areaL: job.result.areaL,
      areaR: job.result.areaR,
      jobId: job.jobId,
      inputId: job.input.inputId
    }
    ret.graph3.data.push(curObject);

  });

  ret.graph4.data = sortByKey(ret.graph4.data, 'name');
  return ret;
}

export function convertMLResults(jobs) {
  let finished = jobs.filter(x => x.status === "finished");
  let ret;

  ret = {
    graph1:
    {
      data: [],
      title: "Sound Types",
      xAxisLabel: "File Name",
      yAxisLabel: "Sound",
      dataKey1: "soundType",
    }
  };
  
  finished.forEach((job) => {
    const jobResult = []

    // For every data point, determine Y value to graph based on sound recognized
    job.result.sounds.forEach(sound => {
      let curObject = {
        name: job.input.name,
        soundType: SoundTypes.indexOf(sound.soundType),
        confidence: sound.confidence,
        startTime: sound.startTime,
        jobId: job.jobId,
        inputId: job.input.inputId
      }

      jobResult.push(curObject);
    });

    jobResult.sort((data1, data2) => data1.startTime - data2.startTime);
    ret.graph1.data.push(...jobResult);
  });

  return ret;
}

/********** Comparison graph data modeling functions **********/

export function convertRMSResultsBySite(jobs, sites) {

  const chosenSiteJobs = jobs.filter(x => x.input.site === sites[0] && x.status === "finished");
  const compareSiteJobs = jobs.filter(x => x.input.site === sites[1] && x.status === "finished");

  let chosenResults = convertRMSResults(chosenSiteJobs);
  let compareResults = convertRMSResults(compareSiteJobs);

  let chosenData = chosenResults.graph1.data;
  let compareData = compareResults.graph1.data;
  let concat = chosenData.concat(compareData);

  chosenResults.graph1.data = concat;
  chosenResults.graph1['avgLC'] = compareResults.graph1.avgL;
  chosenResults.graph1['avgRC'] = compareResults.graph1.avgR;

  return chosenResults;
}

export function convertRMSResultsBySeries(jobs, series) {

  const chosenSeriesJobs = jobs.filter(x => x.input.series === series[0] && x.status === "finished");
  const compareSeriesJobs = jobs.filter(x => x.input.series === series[1] && x.status === "finished");

  let chosenResults = convertRMSResults(chosenSeriesJobs);
  let compareResults = convertRMSResults(compareSeriesJobs);

  let chosenData = chosenResults.graph1.data;
  let compareData = compareResults.graph1.data;
  let concat = chosenData.concat(compareData);

  chosenResults.graph1.data = concat;
  chosenResults.graph1['avgLC'] = compareResults.graph1.avgL;
  chosenResults.graph1['avgRC'] = compareResults.graph1.avgR;

  return chosenResults;
}

function replaceACI(compareData){
  compareData.data.forEach(item => {
    item['aciLeftC'] = item['aciLeft'];
    item['aciRightC'] = item['aciRight'];
    delete(item['aciLeft']);
    delete(item['aciRight']);
  });
  return compareData;
}

export function convertACIResultsBySite(jobs, sites) {

  const chosenSiteJobs = jobs.filter(x => x.input.site === sites[0] && x.status === "finished");
  const compareSiteJobs = jobs.filter(x => x.input.site === sites[1] && x.status === "finished");

  let chosenResults = convertACIResults(chosenSiteJobs);
  let compareResults = convertACIResults(compareSiteJobs);

  let chosenBySeconds = chosenResults.graph1;
  let chosenByFile = chosenResults.graph2;
  let chosenByBands = chosenResults.graph3;
  let chosenByDate = chosenResults.graph4;

  let compareBySeconds = compareResults.graph1;
  let compareByFile = compareResults.graph2;
  let compareByBands = compareResults.graph3;
  let compareByDate = compareResults.graph4;

  // rename keys in compare data
  // compareBySeconds = replaceACI(compareBySeconds);
  compareByDate = replaceACI(compareByDate);

  compareByFile.data.forEach(item => {
    item['aciTotAllByMinLC'] = item['aciTotAllByMinL'];
    item['aciTotAllByMinRC'] = item['aciTotAllByMinR'];
    delete(item['aciTotAllByMinL']);
    delete(item['aciTotAllByMinR']);
  });

  let secondsData = chosenBySeconds.data.concat(compareBySeconds.data);
  let fileData = chosenByFile.data.concat(compareByFile.data);
  let dateData = chosenByDate.data.concat(compareByDate.data);
  let bandsData = chosenByBands.data.concat(compareByBands.data);

  secondsData = sortByKey(secondsData, 'name');
  fileData = sortByKey(fileData, 'name');
  dateData = sortByKey(dateData, 'name');

  // let compressedSecondsData = mergeLikeNames(secondsData);
  let compressedDateData = mergeLikeNames(dateData);

  let ret = {
    graph1: {
      data: secondsData,
      title: "Compared Over Seconds Per File",
      xAxisLabel: "File Name",
      yAxisLabel: "ACI",
      dataKey1: 'aciLeft',
      dataKey2: 'aciRight',
      dataKey3: 'aciLeftC',
      dataKey4: 'aciRightC'
    },
    graph2: {
      data: fileData,
      title: "Compared By File",
    },
    graph3: {
      data: compressedDateData,
      title: "Compared Date",
      xAxisLabel: "Date",
      yAxisLabel: "ACI",
      dataKey1: 'aciLeft',
      dataKey2: 'aciRight',
      dataKey3: 'aciLeftC',
      dataKey4: 'aciRightC'
    },
    graph4: {
      data: bandsData,
      title: "Compared By Band Values"
    }
  }

  return ret;
}

export function convertACIResultsBySeries(jobs, series) {

  const chosenSeriesJobs = jobs.filter(x => x.input.series === series[0] && x.status === "finished");
  const compareSeriesJobs = jobs.filter(x => x.input.series === series[1] && x.status === "finished");

  let chosenResults = convertACIResults(chosenSeriesJobs);
  let compareResults = convertACIResults(compareSeriesJobs);

  let chosenBySeconds = chosenResults.graph1;
  let chosenByFile = chosenResults.graph2;
  let chosenByBands = chosenResults.graph3;
  let chosenByDate = chosenResults.graph4;

  let compareBySeconds = compareResults.graph1;
  let compareByFile = compareResults.graph2;
  let compareByBands = compareResults.graph3;
  let compareByDate = compareResults.graph4;

  // rename keys in compare data
  // compareBySeconds = replaceACI(compareBySeconds);
  compareByDate = replaceACI(compareByDate);

  compareByFile.data.forEach(item => {
    item['aciTotAllByMinLC'] = item['aciTotAllByMinL'];
    item['aciTotAllByMinRC'] = item['aciTotAllByMinR'];
    delete(item['aciTotAllByMinL']);
    delete(item['aciTotAllByMinR']);
  });

  let secondsData = chosenBySeconds.data.concat(compareBySeconds.data);
  let fileData = chosenByFile.data.concat(compareByFile.data);
  let dateData = chosenByDate.data.concat(compareByDate.data);
  let bandsData = chosenByBands.data.concat(compareByBands.data);

  secondsData = sortByKey(secondsData, 'name');
  fileData = sortByKey(fileData, 'name');
  dateData = sortByKey(dateData, 'name');

  // let compressedSecondsData = mergeLikeNames(secondsData);
  let compressedDateData = mergeLikeNames(dateData);

  let ret = {
    graph1: {
      data: secondsData,
      title: "Compared Over Seconds Per File",
      xAxisLabel: "File Name",
      yAxisLabel: "ACI",
      dataKey1: 'aciLeft',
      dataKey2: 'aciRight',
      dataKey3: 'aciLeftC',
      dataKey4: 'aciRightC'
    },
    graph2: {
      data: fileData,
      title: "Compared By File",
    },
    graph3: {
      data: compressedDateData,
      title: "Compared By Date",
      xAxisLabel: "Date",
      yAxisLabel: "ACI",
      dataKey1: 'aciLeft',
      dataKey2: 'aciRight',
      dataKey3: 'aciLeftC',
      dataKey4: 'aciRightC'
    },
    graph4: {
      data: bandsData,
      title: "Compared By Band Values"
    }
  }

  return ret;
}

function replaceNDSI(compareData, channel){
  if(channel){
    compareData.data.forEach(item => {
      item['anthrophonyC'] = item['anthrophony'];
      item['biophonyC'] = item['biophony'];
      item['ndsiC'] = item['ndsi'];
      delete(item['anthrophony']);
      delete(item['biophony']);
      delete(item['ndsi']);
    });
    return compareData;
  }

  compareData.data.forEach(item => {
    item['leftChannelC'] = item['leftChannel'];
    item['rightChannelC'] = item['rightChannel'];
    delete(item['leftChannel']);
    delete(item['rightChannel']);
  });
  return compareData;
}

export function convertNDSIResultsBySite(jobs, sites) {
  const chosenSiteJobs = jobs.filter(x => x.input.site === sites[0]);
  const compareSiteJobs = jobs.filter(x => x.input.site === sites[1]);

  let chosenResults = convertNDSIResults(chosenSiteJobs);
  let compareResults = convertNDSIResults(compareSiteJobs);

  let chosenChannels = chosenResults.graph1;
  let chosenValues = chosenResults.graph2;
  let chosenFiles = chosenResults.graph5;

  let compareChannels = compareResults.graph1;
  let compareValues = compareResults.graph2;
  let compareFiles = compareResults.graph5;

  // rename keys in compare data
  compareChannels = replaceNDSI(compareChannels, true);
  compareValues = replaceNDSI(compareValues, false);

  let channelsData = chosenChannels.data.concat(compareChannels.data);
  let valuesData = chosenValues.data.concat(compareValues.data);
  let filesData = chosenFiles.data.concat(compareFiles.data);

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
    },
    graph3: {
      data: filesData,
      title: "Compared By File",
    },
  }

  return ret;
}

export function convertNDSIResultsBySeries(jobs, series) {

  const chosenSeriesJobs = jobs.filter(x => x.input.series === series[0] && x.status === "finished");
  const compareSeriesJobs = jobs.filter(x => x.input.series === series[1] && x.status === "finished");

  let chosenResults = convertNDSIResults(chosenSeriesJobs);
  let compareResults = convertNDSIResults(compareSeriesJobs);

  let chosenChannels = chosenResults.graph1;
  let chosenValues = chosenResults.graph2;
  let chosenFiles = chosenResults.graph5;

  let compareChannels = compareResults.graph1;
  let compareValues = compareResults.graph2;
  let compareFiles = compareResults.graph5;

  // rename keys in compare data
  compareChannels = replaceNDSI(compareChannels, true);
  compareValues = replaceNDSI(compareValues, false);

  let channelsData = chosenChannels.data.concat(compareChannels.data);
  let valuesData = chosenValues.data.concat(compareValues.data);
  let filesData = chosenFiles.data.concat(compareFiles.data);

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
    },
    graph3: {
      data: filesData,
      title: "Compared By File",
    },
  }

  return ret;
}

function replaceBI(compareData, spectrum){
  if(spectrum){
    compareData.data.forEach(item => {
      item['leftSpectrumC'] = item['leftSpectrum'];
      item['rightSpectrumC'] = item['rightSpectrum'];
      delete(item['leftSpectrum']);
      delete(item['rightSpectrum']);
    });
    return compareData;
  }

  compareData.data.forEach(item => {
    item['areaLC'] = item['areaL'];
    item['areaRC'] = item['areaR'];
    delete(item['areaL']);
    delete(item['areaR']);
  });
  return compareData;
}

export function convertBIResultsBySite(jobs, sites) {

  const chosenSiteJobs = jobs.filter(x => x.input.site === sites[0] && x.status === "finished");
  const compareSiteJobs = jobs.filter(x => x.input.site === sites[1] && x.status === "finished");

  let chosenResults = convertBIResults(chosenSiteJobs);
  let compareResults = convertBIResults(compareSiteJobs);

  let chosenSpectrumValues = chosenResults.graph1;
  let chosenByDate = chosenResults.graph4;
  let chosenFileData = chosenResults.fileData.files;

  let compareSpectrumValues = compareResults.graph1;
  let compareByDate = compareResults.graph4;
  let compareFileData = compareResults.fileData.files;

  // rename keys in compare data
  compareSpectrumValues = replaceBI(compareSpectrumValues, true);
  compareByDate = replaceBI(compareByDate, false);

  let spectrumData = chosenSpectrumValues.data.concat(compareSpectrumValues.data);
  let dateData = chosenByDate.data.concat(compareByDate.data);

  let fileNames = Object.keys(chosenFileData).concat(Object.keys(compareFileData));

  let concatFileData = Object.assign({}, chosenFileData, compareFileData);

  spectrumData = sortByKey(spectrumData, 'name');
  dateData = sortByKey(dateData, 'name');

  let compressedSpectrumData = mergeLikeNames(spectrumData);
  let compressedDateData = mergeLikeNames(dateData);

  let ret = {
    fileData:
    {
      title: "File Data",
      files: concatFileData,
      fileNames: fileNames,
    },
    graph1: {
      data: compressedSpectrumData,
      title: "Compared By Spectrum Values",
      xAxisLabel: "Hz Range",
      yAxisLabel: "Spectrum",
      dataKey1: 'leftSpectrum',
      dataKey2: 'rightSpectrum',
      dataKey3: 'leftSpectrumC',
      dataKey4: 'rightSpectrumC'
    },
    graph3: {
      data: compressedDateData,
      title: "Compared By Date",
      xAxisLabel: "Date",
      yAxisLabel: "Bioacoustic Area",
      dataKey1: 'areaL',
      dataKey2: 'areaR',
      dataKey3: 'areaLC',
      dataKey4: 'areaRC'
    }
  }

  return ret;
}

export function convertBIResultsBySeries(jobs, series) {

  const chosenSeriesJobs = jobs.filter(x => x.input.series === series[0] && x.status === "finished");
  const compareSeriesJobs = jobs.filter(x => x.input.series === series[1] && x.status === "finished");

  let chosenResults = convertBIResults(chosenSeriesJobs);
  let compareResults = convertBIResults(compareSeriesJobs);

  let chosenSpectrumValues = chosenResults.graph1;
  let chosenByDate = chosenResults.graph4;
  let chosenFileData = chosenResults.fileData.files;

  let compareSpectrumValues = compareResults.graph1;
  let compareByDate = compareResults.graph4;
  let compareFileData = compareResults.fileData.files;

  // rename keys in compare data
  compareSpectrumValues = replaceBI(compareSpectrumValues, true);
  compareByDate = replaceBI(compareByDate, false);

  let spectrumData = chosenSpectrumValues.data.concat(compareSpectrumValues.data);
  let dateData = chosenByDate.data.concat(compareByDate.data);

  let fileNames = Object.keys(chosenFileData).concat(Object.keys(compareFileData));

  let concatFileData = Object.assign({}, chosenFileData, compareFileData);

  spectrumData = sortByKey(spectrumData, 'name');
  dateData = sortByKey(dateData, 'name');

  let compressedSpectrumData = mergeLikeNames(spectrumData);
  let compressedDateData = mergeLikeNames(dateData);

  let ret = {
    fileData:
    {
      title: "File Data",
      files: concatFileData,
      fileNames: fileNames,
    },
    graph1: {
      data: compressedSpectrumData,
      title: "Compared By Spectrum Values",
      xAxisLabel: "Hz Range",
      yAxisLabel: "Spectrum",
      dataKey1: 'leftSpectrum',
      dataKey2: 'rightSpectrum',
      dataKey3: 'leftSpectrumC',
      dataKey4: 'rightSpectrumC'
    },
    graph3: {
      data: compressedDateData,
      title: "Compared By Date",
      xAxisLabel: "Date",
      yAxisLabel: "Bioacoustic Area",
    }
  }

  return ret;
}

function replaceADIAEI(compareData, bands, aei){
  if(bands){
    compareData.data.forEach(item => {
      item['leftBandValC'] = item['leftBandVal'];
      item['rightBandValC'] = item['rightBandVal'];
      delete(item['leftBandVal']);
      delete(item['rightBandVal']);
    });
    return compareData;
  }

  if(aei){
    compareData.data.forEach(item => {
      item['leftAEIValC'] = item['leftAEIVal'];
      item['rightAEIValC'] = item['rightAEIVal'];
      delete(item['leftAEIVal']);
      delete(item['rightAEIVal']);
    });
    return compareData;
  }

  compareData.data.forEach(item => {
    item['leftADIValC'] = item['leftADIVal'];
    item['rightADIValC'] = item['rightADIVal'];
    delete(item['leftADIVal']);
    delete(item['rightADIVal']);
  });
  return compareData;
}

export function convertADIResultsBySite(jobs, sites) {

  const chosenSiteJobs = jobs.filter(x => x.input.site === sites[0] && x.status === "finished");
  const compareSiteJobs = jobs.filter(x => x.input.site === sites[1] && x.status === "finished");

  let chosenResults = convertADIResults(chosenSiteJobs);
  let compareResults = convertADIResults(compareSiteJobs);

  let chosenBandValues = chosenResults.graph1;
  let chosenByDate = chosenResults.graph4;
  let chosenFileData = chosenResults.fileData.files;
  let chosenLeft = chosenBandValues.left;
  let chosenRight = chosenBandValues.right;

  let compareBandValues = compareResults.graph1;
  let compareByDate = compareResults.graph4;
  let compareFileData = compareResults.fileData.files;
  let compareLeft = compareBandValues.left;
  let compareRight = compareBandValues.right;

  // rename keys in compare data
  compareBandValues = replaceADIAEI(compareBandValues, true, false);
  compareByDate = replaceADIAEI(compareByDate, false, false);

  let bandData = chosenBandValues.data.concat(compareBandValues.data);
  let dateData = chosenByDate.data.concat(compareByDate.data);

  let fileNames = Object.keys(chosenFileData).concat(Object.keys(compareFileData));

  let concatFileData = Object.assign({}, chosenFileData, compareFileData);

  bandData = sortByKey(bandData, 'name');
  dateData = sortByKey(dateData, 'name');

  let compressedBandData = mergeLikeNames(bandData);
  let compressedDateData = mergeLikeNames(dateData);

  let ret = {
    graph1: {
      data: compressedBandData,
      title: "Compared By Band Values",
      xAxisLabel: "Hz Range",
      yAxisLabel: "ADI",
      dataKey1: "leftBandVal",
      dataKey2: "rightBandVal",
      dataKey3: "leftBandValC",
      dataKey4: "rightBandValC",
      left: chosenLeft,
      right: chosenRight,
      leftC: compareLeft,
      rightC: compareRight,
    },
    fileData:
    {
      title: "File Data",
      files: concatFileData,
      fileNames: fileNames,
    },
    graph3: {
      data: compressedDateData,
      title: "Compared By Date",
      xAxisLabel: "Date",
      yAxisLabel: "ADI",
      dataKey1: "leftADIVal",
      dataKey2: "rightADIVal",
      dataKey3: "leftADIValC",
      dataKey4: "rightADIValC",
      left: chosenLeft,
      right: chosenRight,
      leftC: compareLeft,
      rightC: compareRight,
    }
  }

  return ret;
}

export function convertADIResultsBySeries(jobs, series) {

  const chosenSeriesJobs = jobs.filter(x => x.input.series === series[0] && x.status === "finished");
  const compareSeriesJobs = jobs.filter(x => x.input.series === series[1] && x.status === "finished");

  let chosenResults = convertADIResults(chosenSeriesJobs);
  let compareResults = convertADIResults(compareSeriesJobs);

  let chosenBandValues = chosenResults.graph1;
  let chosenByDate = chosenResults.graph4;
  let chosenFileData = chosenResults.fileData.files;
  let chosenLeft = chosenBandValues.left;
  let chosenRight = chosenBandValues.right;

  let compareBandValues = compareResults.graph1;
  let compareByDate = compareResults.graph4;
  let compareFileData = compareResults.fileData.files;
  let compareLeft = compareBandValues.left;
  let compareRight = compareBandValues.right;


  // rename keys in compare data
  compareBandValues = replaceADIAEI(compareBandValues, true);
  compareByDate = replaceADIAEI(compareByDate, false);

  let bandData = chosenBandValues.data.concat(compareBandValues.data);
  let dateData = chosenByDate.data.concat(compareByDate.data);

  let fileNames = Object.keys(chosenFileData).concat(Object.keys(compareFileData));

  let concatFileData = Object.assign({}, chosenFileData, compareFileData);

  bandData = sortByKey(bandData, 'name');
  dateData = sortByKey(dateData, 'name');

  let compressedBandData = mergeLikeNames(bandData);
  let compressedDateData = mergeLikeNames(dateData);

  let ret = {
    graph1: {
      data: compressedBandData,
      title: "Compared By Band Values",
      xAxisLabel: "Hz Range",
      yAxisLabel: "ADI",
      dataKey1: "leftBandVal",
      dataKey2: "rightBandVal",
      dataKey3: "leftBandValC",
      dataKey4: "rightBandValC",
      left: chosenLeft,
      right: chosenRight,
      leftC: compareLeft,
      rightC: compareRight,
    },
    fileData:
    {
      title: "File Data",
      files: concatFileData,
      fileNames: fileNames,
    },
    graph3: {
      data: compressedDateData,
      title: "Compared By Date",
      xAxisLabel: "Date",
      yAxisLabel: "ADI",
      dataKey1: "leftADIVal",
      dataKey2: "rightADIVal",
      dataKey3: "leftADIValC",
      dataKey4: "rightADIValC",
      left: chosenLeft,
      right: chosenRight,
      leftC: compareLeft,
      rightC: compareRight,
    }
  }

  return ret;
}

export function convertAEIResultsBySite(jobs, sites) {
  const chosenSiteJobs = jobs.filter(x => x.input.site === sites[0] && x.status === "finished");
  const compareSiteJobs = jobs.filter(x => x.input.site === sites[1] && x.status === "finished");

  let chosenResults = convertAEIResults(chosenSiteJobs);
  let compareResults = convertAEIResults(compareSiteJobs);

  let chosenBandValues = chosenResults.graph1;
  let chosenByDate = chosenResults.graph4;
  let chosenFileData = chosenResults.fileData.files;
  let chosenLeft = chosenBandValues.left;
  let chosenRight = chosenBandValues.right;

  let compareBandValues = compareResults.graph1;
  let compareByDate = compareResults.graph4;
  let compareFileData = compareResults.fileData.files;
  let compareLeft = compareBandValues.left;
  let compareRight = compareBandValues.right;

  // rename keys in compare data
  compareBandValues = replaceADIAEI(compareBandValues, true, true);
  compareByDate = replaceADIAEI(compareByDate, false, true);

  let bandData = chosenBandValues.data.concat(compareBandValues.data);
  let dateData = chosenByDate.data.concat(compareByDate.data);

  let fileNames = Object.keys(chosenFileData).concat(Object.keys(compareFileData));

  let concatFileData = Object.assign({}, chosenFileData, compareFileData);

  bandData = sortByKey(bandData, 'name');
  dateData = sortByKey(dateData, 'name');

  let compressedBandData = mergeLikeNames(bandData);
  let compressedDateData = mergeLikeNames(dateData);

  let ret = {
    graph1: {
      data: compressedBandData,
      title: "Compared By Band Values",
      xAxisLabel: "Hz Range",
      yAxisLabel: "AEI",
      dataKey1: "leftBandVal",
      dataKey2: "rightBandVal",
      dataKey3: "leftBandValC",
      dataKey4: "rightBandValC",
      left: chosenLeft,
      right: chosenRight,
      leftC: compareLeft,
      rightC: compareRight,
    },
    fileData:
    {
      title: "File Data",
      files: concatFileData,
      fileNames: fileNames,
    },
    graph3: {
      data: compressedDateData,
      title: "Compared By Date",
      xAxisLabel: "Date",
      yAxisLabel: "AEI",
      dataKey1: "leftAEIVal",
      dataKey2: "rightAEIVal",
      dataKey3: "leftAEIValC",
      dataKey4: "rightAEIValC",
      left: chosenLeft,
      right: chosenRight,
      leftC: compareLeft,
      rightC: compareRight,
    }
  }

  return ret;
}

export function convertAEIResultsBySeries(jobs, series) {
  const chosenSeriesJobs = jobs.filter(x => x.input.series === series[0] && x.status === "finished");
  const compareSeriesJobs = jobs.filter(x => x.input.series === series[1] && x.status === "finished");

  let chosenResults = convertAEIResults(chosenSeriesJobs);
  let compareResults = convertAEIResults(compareSeriesJobs);

  let chosenBandValues = chosenResults.graph1;
  let chosenByDate = chosenResults.graph4;
  let chosenFileData = chosenResults.fileData.files;
  let chosenLeft = chosenBandValues.left;
  let chosenRight = chosenBandValues.right;

  let compareBandValues = compareResults.graph1;
  let compareByDate = compareResults.graph4;
  let compareFileData = compareResults.fileData.files;
  let compareLeft = compareBandValues.left;
  let compareRight = compareBandValues.right;

  // rename keys in compare data
  compareBandValues = replaceADIAEI(compareBandValues, true, true);
  compareByDate = replaceADIAEI(compareByDate, false, true);

  let bandData = chosenBandValues.data.concat(compareBandValues.data);
  let dateData = chosenByDate.data.concat(compareByDate.data);

  let fileNames = Object.keys(chosenFileData).concat(Object.keys(compareFileData));

  let concatFileData = Object.assign({}, chosenFileData, compareFileData);

  bandData = sortByKey(bandData, 'name');
  dateData = sortByKey(dateData, 'name');

  let compressedBandData = mergeLikeNames(bandData);
  let compressedDateData = mergeLikeNames(dateData);

  let ret = {
    graph1: {
      data: compressedBandData,
      title: "Compared By Band Values",
      xAxisLabel: "Hz Range",
      yAxisLabel: "AEI",
      dataKey1: "leftBandVal",
      dataKey2: "rightBandVal",
      dataKey3: "leftBandValC",
      dataKey4: "rightBandValC",
      left: chosenLeft,
      right: chosenRight,
      leftC: compareLeft,
      rightC: compareRight,
    },
    fileData:
    {
      title: "File Data",
      files: concatFileData,
      fileNames: fileNames,
    },
    graph3: {
      data: compressedDateData,
      title: "Compared By Date",
      xAxisLabel: "Date",
      yAxisLabel: "AEI",
      dataKey1: "leftAEIVal",
      dataKey2: "rightAEIVal",
      dataKey3: "leftAEIValC",
      dataKey4: "rightAEIValC",
      left: chosenLeft,
      right: chosenRight,
      leftC: compareLeft,
      rightC: compareRight,
    }
  }

  return ret;
}