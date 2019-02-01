import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IndexAnalysisPanel from './indexAnalysisPanel';
import SpecAnalysisPanel from './specAnalysisPanel';

function convertNDSIResults(jobs) {
  let ret;

  let ndsiLTotal = 0;
  let ndsiRTotal = 0;
  let biophonyLTotal = 0;
  let biophonyRTotal = 0;
  let anthrophonyLTotal = 0;
  let anthrophonyRTotal = 0;

  // REMEMBER TO CHANGE DUMMY TO JOBS
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
    graph3: {
      data: [],
      title: "NDSI By Hour"
    },
    graph4: {
      data: [],
      title: "NDSI By Date"
    },
    graph5: {
      data: [],
      title: "NDSI By File"
    }
  }

  let dayDate;
  let oldDate = new Date(18000000);
  let dateObject;
  let counter;
  jobs.forEach(function(job){
    let date = new Date(job.input.recordTimeMs);
    dayDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    let oldDateString = (oldDate.getMonth() + 1) + '/' + oldDate.getDate() + '/' + oldDate.getFullYear();
    let curObject;

    if(oldDateString === dayDate)
    {
      // we are still on same day
      dateObject.ndsiL += job.result.ndsiL;
      dateObject.ndsiR += job.result.ndsiR;
      dateObject.biophonyL += job.result.biophonyL;
      dateObject.biophonyR += job.result.biophonyR;
      dateObject.anthrophonyL += job.result.anthrophonyL;
      dateObject.anthrophonyR += job.result.anthrophonyR;

      counter += 1;

    }else{
      // we are on a new day
      if(oldDateString !== '1/1/1970'){

        dateObject.ndsiL /= counter;
        dateObject.ndsiR /= counter;
        dateObject.biophonyL /= counter;
        dateObject.biophonyR /= counter;
        dateObject.anthrophonyL /= counter;
        dateObject.anthrophonyR /= counter;

        ret.graph4.data.push(dateObject);
      }
      counter = 0;

      dateObject = {
        name: dayDate,
        ndsiL: job.result.ndsiL,
        ndsiR: job.result.ndsiR,
        biophonyL: job.result.biophonyL,
        biophonyR: job.result.biophonyR,
        anthrophonyL: job.result.anthrophonyL,
        anthrophonyR: job.result.anthrophonyR
      }

      counter += 1;
    }

    curObject = {
      name: date.getHours() + ':' + date.getMinutes(),
      ndsiL: job.result.ndsiL,
      ndsiR: job.result.ndsiR,
      biophonyL: job.result.biophonyL,
      biophonyR: job.result.biophonyR,
      anthrophonyL: job.result.anthrophonyL,
      anthrophonyR: job.result.anthrophonyR
    }

    ret.graph3.data.push(curObject);

    curObject = {
      name: job.fileName,
      ndsiL: job.result.ndsiL,
      ndsiR: job.result.ndsiR,
      biophonyL: job.result.biophonyL,
      biophonyR: job.result.biophonyR,
      anthrophonyL: job.result.anthrophonyL,
      anthrophonyR: job.result.anthrophonyR
    }

    ret.graph5.data.push(curObject);

    oldDate = date;
  });

  dateObject.ndsiL /= counter;
  dateObject.ndsiR /= counter;
  dateObject.biophonyL /= counter;
  dateObject.biophonyR /= counter;
  dateObject.anthrophonyL /= counter;
  dateObject.anthrophonyR /= counter;

  ret.graph4.data.push(dateObject);


  return ret;
}

function convertACIResults(jobs) {
  let ret;
  let aciTotAllL = 0;
  let aciTotAllR = 0;
  let aciTotAllByMinL = 0;
  let aciTotAllByMinR = 0;

  let aciFlValsL = [];
  let aciFlValsR = [];

  // REMEMBER TO CHANGE DUMMY TO JOBS
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
    // graph2:
    // {
    //   data:
    //   [
    //     {
    //       name: 'ACI Total Left Channel',
    //       data: aciTotAllL
    //     },
    //     {
    //       name: 'ACI Total Right Channel',
    //       data: aciTotAllR
    //     },
    //     {
    //       name: 'ACI Total By Minutes Left Channel',
    //       data: aciTotAllByMinL
    //     },
    //     {
    //       name: 'ACI Total By Minutes Right Channel',
    //       data: aciTotAllByMinR
    //     }
    //   ]
    // },
    graph3:
    {
      data: [],
      title: "ACI By Hour",
      xAxisLabel: "Hour of Day",
      yAxisLabel: "ACI Value",
      dataKey1: 'aciLeft',
      dataKey2: 'aciRight'
    },
    graph4:
    {
      data: [],
      title: "ACI By Date",
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

  let dayDate;
  let oldDate = new Date(18000000);
  let dateObject;
  let counter;
  jobs.forEach(function(job){
    let date = new Date(job.input.recordTimeMs);
    dayDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    let oldDateString = (oldDate.getMonth() + 1) + '/' + oldDate.getDate() + '/' + oldDate.getFullYear();
    let curObject;
    if(oldDateString === dayDate){
      // we are still on same day

      dateObject.aciLeft += job.result.aciTotAllByMinL;
      dateObject.aciRight += job.result.aciTotAllByMinR;
      counter += 1;

    }else{
      // we are on a new day
      if(oldDateString !== '1/1/1970')
      {
        dateObject.aciLeft /= counter;
        dateObject.aciRight /= counter;
        ret.graph4.data.push(dateObject);
      }
      counter = 0;

      dateObject =
      {
        name: dayDate,
        aciLeft: job.result.aciTotAllByMinL,
        aciRight: job.result.aciTotAllByMinR
      }
      counter += 1;
    }

    curObject =
    {
      name: date.getHours() + ':' + date.getMinutes(),
      aciLeft: job.result.aciTotAllByMinL,
      aciRight: job.result.aciTotAllByMinR
    }

    ret.graph3.data.push(curObject);

    curObject =
    {
      name: job.input.fileName,
      aciLeft: job.result.aciTotAllByMinL,
      aciRight: job.result.aciTotAllByMinR
    }

    ret.graph5.data.push(curObject);

    oldDate = date;
  });

  dateObject.aciLeft /= counter;
  dateObject.aciRight /= counter;
  ret.graph4.data.push(dateObject);

  return ret;
}

function convertADIResults(jobs) {

  let ret;

  let arrLength = jobs[0].input.result.ADIbandValsL.length;
  let adiLTotal = 0;
  let adiRTotal = 0;
  let adiLBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);
  let adiRBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);

  // REMEMBER TO CHANGE DUMMY TO JOBS
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
      dataKey1: "leftBandVal",
      dataKey2: "rightBandVal",
      refL: adiLAvg,
      refR: adiRAvg
    },
    graph2:
    {
      data: [],
      title: "ADI By File",
      xAxisLabel: "File Name",
      dataKey1: "leftADIVal",
      dataKey2: "rightADIVal",
      refL: adiLAvg,
      refR: adiRAvg
    },
    // graph3:
    // {
    //   data:
    //   [
    //     {
    //       name: 'ADI Left Channel',
    //       data: adiLAvg
    //     },
    //     {
    //       name: 'ADI Right Channel',
    //       data: adiRAvg
    //     }
    //   ]
    // },
    graph4:
    {
      data: [],
      title: "ADI By Date",
      xAxisLabel: "Date",
      dataKey1: "leftADIVal",
      dataKey2: "rightADIVal",
      refL: adiLAvg,
      refR: adiRAvg
    },
    graph5:
    {
      data: [],
      title: "ADI By Hour",
      xAxisLabel: "Hour of Day",
      dataKey1: "leftADIVal",
      dataKey2: "rightADIVal",
      refL: adiLAvg,
      refR: adiRAvg
    }
  }

  for(var i = 0; i < adiLBand.length; i++)
  {
    let curObject =
    {
      name: jobs[0].input.result.ADIbandRangeL[i],
      leftBandVal: adiLBand[i],
      rightBandVal: adiRBand[i]
    }

    ret.graph1.data.push(curObject);
  }

  let dayDate;
  let oldDate = new Date(18000000);
  let dateObject;
  let counter;
  jobs.forEach(function(job){
    let date = new Date(job.input.recordTimeMs);
    dayDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    let oldDateString = (oldDate.getMonth() + 1) + '/' + oldDate.getDate() + '/' + oldDate.getFullYear();
    let curObject;
    if(oldDateString === dayDate){
      // we are still on same day

      dateObject.leftADIVal += job.result.adiL;
      dateObject.rightADIVal += job.result.adiR;
      counter += 1;

    }else{
      // we are on a new day
      if(oldDateString !== '1/1/1970')
      {
        dateObject.leftADIVal /= counter;
        dateObject.rightADIVal /= counter;
        ret.graph4.data.push(dateObject);
      }
      counter = 0;

      dateObject =
      {
        name: dayDate,
        leftADIVal: job.result.adiL,
        rightADIVal: job.result.adiR
      }
      counter += 1;
    }

    curObject =
    {
      name: date.getHours() + ':' + date.getMinutes(),
      leftADIVal: job.result.adiL,
      rightADIVal: job.result.adiR
    }

    ret.graph5.data.push(curObject);

    curObject =
    {
      name: job.input.fileName,
      leftADIVal: job.result.adiL,
      rightADIVal: job.result.adiR
    }

    ret.graph2.data.push(curObject);

    oldDate = date;
  });

  dateObject.leftADIVal /= counter;
  dateObject.rightADIVal /= counter;
  ret.graph4.data.push(dateObject);

  return ret;
}

function convertAEIResults(jobs) {
  let ret;

  let arrLength = jobs[0].input.result.AEIbandValsL.length;
  let aeiLTotal = 0;
  let aeiRTotal = 0;
  let aeiLBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);
  let aeiRBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);

  // REMEMBER TO CHANGE DUMMY TO JOBS
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
      dataKey1: "leftBandVal",
      dataKey2: "rightBandVal",
      refL: aeiLAvg,
      refR: aeiRAvg
    },
    graph2:
    {
      data: [],
      title: "AEI By File",
      dataKey1: "leftAEIVal",
      dataKey2: "rightAEIVal",
      refL: aeiLAvg,
      refR: aeiRAvg
    },
    // graph3:
    // {
    //   data:
    //   [
    //     {
    //       name: 'ADI Left Channel',
    //       data: adiLAvg
    //     },
    //     {
    //       name: 'ADI Right Channel',
    //       data: adiRAvg
    //     }
    //   ]
    // },
    graph4:
    {
      data: [],
      title: "AEI By Date",
      dataKey1: "leftAEIVal",
      dataKey2: "rightAEIVal",
      refL: aeiLAvg,
      refR: aeiRAvg
    },
    graph5:
    {
      data: [],
      title: "AEI By Hour",
      dataKey1: "leftAEIVal",
      dataKey2: "rightAEIVal",
      refL: aeiLAvg,
      refR: aeiRAvg
    }
  }

  for(var i = 0; i < aeiLBand.length; i++)
  {
    let curObject =
    {
      name: jobs[0].input.result.AEIbandRangeL[i],
      leftBandVal: aeiLBand[i],
      rightBandVal: aeiRBand[i]
    }

    ret.graph1.data.push(curObject);
  }

  let dayDate;
  let oldDate = new Date(18000000);
  let dateObject;
  let counter;
  jobs.forEach(function(job){
    let date = new Date(job.input.recordTimeMs);
    dayDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    let oldDateString = (oldDate.getMonth() + 1) + '/' + oldDate.getDate() + '/' + oldDate.getFullYear();
    let curObject;
    if(oldDateString === dayDate){
      // we are still on same day

      dateObject.leftAEIVal += job.result.aeiL;
      dateObject.rightAEIVal += job.result.aeiR;
      counter += 1;

    }else{
      // we are on a new day
      if(oldDateString !== '1/1/1970')
      {
        dateObject.leftAEIVal /= counter;
        dateObject.rightAEIVal /= counter;
        ret.graph4.data.push(dateObject);
      }
      counter = 0;

      dateObject =
      {
        name: dayDate,
        leftAEIVal: job.result.aeiL,
        rightAEIVal: job.result.aeiR
      }
      counter += 1;
    }

    curObject =
    {
      name: date.getHours() + ':' + date.getMinutes(),
      leftAEIVal: job.result.aeiL,
      rightAEIVal: job.result.aeiR
    }

    ret.graph5.data.push(curObject);

    curObject =
    {
      name: job.input.fileName,
      leftAEIVal: job.result.aeiL,
      rightAEIVal: job.result.aeiR
    }

    ret.graph2.data.push(curObject);

    oldDate = date;
  });

  dateObject.leftAEIVal /= counter;
  dateObject.rightAEIVal /= counter;
  ret.graph4.data.push(dateObject);

  return ret;
}

function convertBAResults(jobs) {
  let ret;

  let areaLTotal = 0;
  let areaRTotal = 0;

  jobs.forEach(function(job){
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
    // graph2:
    // {
    //   data:
    //   [
    //     {
    //       name: 'Left Channel Area',
    //       data: areaLTotal
    //     },
    //     {
    //       name: 'Right Channel Area',
    //       data: areaRTotal
    //     }
    //   ]
    // },
    graph3:
    {
      data: [],
      xAxisLabel: "File Name",
      yAxisLabel: "Area Value",
      dataKey1: 'areaL',
      dataKey2: 'areaR',
      title: "Bioacoustic Area Value By File"
    },
    graph4:
    {
      data: [],
      xAxisLabel: "Date",
      yAxisLabel: "Area Value",
      dataKey1: 'areaL',
      dataKey2: 'areaR',
      title: "Bioacoustic Area Value By Date"
    },
    graph5:
    {
      data: [],
      xAxisLabel: "Hour of Day",
      yAxisLabel: "Area Value",
      dataKey1: 'areaL',
      dataKey2: 'areaR',
      title: "Bioacoustic Area Value By Hour"
    }
  }

  for(var i = 0; i < jobs[0].input.result.freq_vals.length; i++)
  {
    let curObject =
    {
      name: jobs[0].input.result.freq_vals[i],
      leftSpectrum: jobs[0].input.result.left_vals[i],
      rightSpectrum: jobs[0].input.result.right_vals[i]
    }

    ret.graph1.data.push(curObject);
  }

  let dayDate;
  let oldDate = new Date(18000000);
  let dateObject;
  let counter;
  jobs.forEach(function(job){
    let date = new Date(job.input.recordTimeMs);
    dayDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    let oldDateString = (oldDate.getMonth() + 1) + '/' + oldDate.getDate() + '/' + oldDate.getFullYear();
    let curObject;
    if(oldDateString === dayDate){
      // we are still on same day

      dateObject.areaL += job.result.areaL;
      dateObject.areaR += job.result.areaR;
      counter += 1;

    }else{
      // we are on a new day
      if(oldDateString !== '1/1/1970')
      {
        dateObject.areaL /= counter;
        dateObject.areaR /= counter;
        ret.graph4.data.push(dateObject);
      }
      counter = 0;

      dateObject =
      {
        name: dayDate,
        areaL: job.result.areaL,
        areaR: job.result.areaR
      }
      counter += 1;
    }

    curObject =
    {
      name: date.getHours() + ':' + date.getMinutes(),
      areaL: job.result.areaL,
      areaR: job.result.areaR
    }

    ret.graph5.data.push(curObject);

    curObject = {
      name: job.input.fileName,
      areaL: job.result.areaL,
      areaR: job.result.areaR
    }
    ret.graph3.data.push(curObject);


    oldDate = date;
  });

  dateObject.areaL /= counter;
  dateObject.areaR /= counter;
  ret.graph4.data.push(dateObject);

  return ret;
}

function convertADIAEICompare(jobs) {
  let ret;

  ret =
  {
    graph1: [], // compare aei and adi by time
    graph2: []  // compare aei and adi by file
  }

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: new Date(new Date(jobs[i].input.recordTimeMs).getTime()).toString(),
      leftADIVal: jobs[i].input.result.adiL,
      rightADIVal: jobs[i].input.result.adiR,
      leftAEIVal: jobs[i].input.result.aeiL,
      rightAEIVal: jobs[i].input.result.aeiR
    }

    ret.graph1.push(curObject);
  }

  jobs.forEach(function(job){
    let curObject =
    {
      name: job.fileName,
      leftADIVal: job.result.adiL,
      rightADIVal: job.result.adiR,
      leftAEIVal: job.result.aeiL,
      rightAEIVal: job.result.aeiR
    }

    ret.graph2.push(curObject);
  });

  return ret;
}

function convertCompareACIResults(jobs) {
  let ret = {
    graph1: convertCompareACIResultsOverTime(jobs),
    graph2: convertCompareACIResultsOverSite(jobs)
  }

  return ret;
}

function convertCompareACIResultsOverTime(jobs) {
  let ret = [];

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: new Date(new Date(jobs[i].input.recordTimeMs).getTime()).toString(),
      leftData: jobs[i].input.result.aciTotAllByMinL,
      rightData: jobs[i].input.result.aciTotAllByMinR
    }

    ret.push(curObject);
  }

  return ret;
}

function convertCompareACIResultsOverSite(jobs) {
  let ret = [];

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: jobs[i].input.siteName,
      leftData: jobs[i].input.result.aciTotAllByMinL,
      rightData: jobs[i].input.result.aciTotAllByMinR
    }

    ret.push(curObject);
  }

  return ret;
}

function convertCompareBioResults(jobs) {
  let ret = {
    graph1: convertCompareBioResultsOverTime(jobs),
    graph2: convertCompareBioResultsOverSite(jobs)
  }

  return ret;
}

function convertCompareBioResultsOverTime(jobs) {
  let ret = [];

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: new Date(new Date(jobs[i].input.recordTimeMs).getTime()).toString(),
      areaL: jobs[i].input.result.areaL,
      areaR: jobs[i].input.result.areaR
    }

    ret.push(curObject);
  }

  return ret;
}

function convertCompareBioResultsOverSite(jobs) {
  let ret = [];

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: jobs[i].input.siteName,
      areaL: jobs[i].input.result.areaL,
      areaR: jobs[i].input.result.areaR
    }

    ret.push(curObject);
  }

  return ret;
}

function convertCompareNDSIResults(jobs) {
  let ret = {
    graph1: convertCompareNDSIResultsOverTime(jobs, 'ndsi'),
    graph2: convertCompareNDSIResultsOverSite(jobs, 'ndsi'),
    graph3: convertCompareNDSIResultsOverTime(jobs, 'biophony'),
    graph4: convertCompareNDSIResultsOverSite(jobs, 'biophony'),
    graph5: convertCompareNDSIResultsOverTime(jobs, 'anthrophony'),
    graph6: convertCompareNDSIResultsOverSite(jobs, 'anthrophony')
  }

  return ret;
}

function convertCompareNDSIResultsOverTime(jobs, value) {
  let ret = [];

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject;

    if(value === 'ndsi')
    {
      curObject = {
        name: new Date(new Date(jobs[i].input.recordTimeMs).getTime()).toString(),
        ndsiL: jobs[i].input.result.ndsiL,
        ndsiR: jobs[i].input.result.ndsiR
      }
    }else if(value === 'biophony')
    {
      curObject = {
        name: new Date(new Date(jobs[i].input.recordTimeMs).getTime()).toString(),
        biophonyL: jobs[i].input.result.biophonyL,
        biophonyR: jobs[i].input.result.biophonyR
      }
    }else if(value === 'anthrophony')
    {
      curObject = {
        name: new Date(new Date(jobs[i].input.recordTimeMs).getTime()).toString(),
        anthrophonyL: jobs[i].input.result.anthrophonyL,
        anthrophonyR: jobs[i].input.result.anthrophonyR
      }
    }

    ret.push(curObject);
  }

  return ret;
}

function convertCompareNDSIResultsOverSite(jobs, value) {
  let ret = [];

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject;

    if(value === 'ndsi')
    {
      curObject = {
        name: jobs[i].input.siteName,
        ndsiL: jobs[i].input.result.ndsiL,
        ndsiR: jobs[i].input.result.ndsiR
      }
    }else if(value === 'biophony')
    {
      curObject = {
        name: jobs[i].input.siteName,
        biophonyL: jobs[i].input.result.biophonyL,
        biophonyR: jobs[i].input.result.biophonyR
      }
    }else if(value === 'anthrophony')
    {
      curObject = {
        name: jobs[i].input.siteName,
        anthrophonyL: jobs[i].input.result.anthrophonyL,
        anthrophonyR: jobs[i].input.result.anthrophonyR
      }
    }

    ret.push(curObject);
  }

  return ret;
}

function convertOutlierResults(job) {
  // let ret = {
  //   graph1: [],
  //   index: job.type
  // }
  //
  // let curObject = {
  //   name: jobs[i].name,
  //   leftData: 0,
  //   rightData: 0
  // }
  //
  // if(ret.index === 'aci')
  // {
  //   curObject.leftData = job.result.aciTotAllByMinL;
  //   curObject.rightData = job.result.aciTotAllByMinR;
  // }else if(ret.index === 'bio')
  // {
  //   curObject.leftData = jobs.result.areaL;
  //   curObject.rightData = jobs.result.areaR;
  // }
  //
  // ret.graph1.push(curObject);

  // for(var i = 0; i < jobs.length; i++)
  // {
  //   let curObject = {
  //     name: jobs[i].name,
  //     leftData: 0,
  //     rightData: 0
  //   }
  //
  //   if(ret.index === 'aci')
  //   {
  //     curObject.leftData = jobs[i].results.aciTotAllByMinL;
  //     curObject.rightData = jobs[i].results.aciTotAllByMinR;
  //   }else if(ret.index === 'bio')
  //   {
  //     curObject.leftData = jobs[i].results.areaL;
  //     curObject.rightData = jobs[i].results.areaR;
  //   }
  //
  //   ret.graph1.push(curObject);
  // }

  // return ret;
}

class AnalysisView extends Component {
  constructor() {
    super();

    this.state = {
      errorMode: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.formatJob(nextProps.chosenResult);
    // if(nextProps.resultToCompare)
    //   this.formatCompare(nextProps.resultToCompare);
    // else
    //   this.setState({ formattedJobToCompare: null });
  }

  componentDidMount = () => {
    if(!this.props.selectedResult)
    {
      this.setState({ errorMode: true });
    }else
    {
      this.formatJob(this.props.selectedResult);
    }
  }

  formatJob = (props) => {
    const rows = [];
    let specRows = [];
    let graphs;

    let { selectedJobs } = this.props;

    // When ready, change dummyData to this.props.selectedJobs
    // loop through each input index
    for (var index in selectedJobs) {
      // skip loop if the property is from prototype
      // if (!dummyData.hasOwnProperty(index)) continue;

      var obj = selectedJobs[index];
      console.log(obj)
      specRows = [];
      for(var spec in obj) {
        // console.log(spec + " = " + obj[spec]);
        switch(index)
        {
          case "aci":
            graphs = convertACIResults(obj[spec])
            break;
          case "ndsi":
            graphs = convertNDSIResults(obj[spec])
            break;
          case "adi":
            graphs = convertADIResults(obj[spec])
            break;
          case "aei":
            graphs = convertAEIResults(obj[spec])
            break;
          case "bio":
            graphs = convertBAResults(obj[spec])
            break;
          default:
            graphs = null
        }

        specRows.push(
          <ExpansionPanel key={index + spec}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <p style={{fontSize: 16+'px'}}>{spec}</p>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <SpecAnalysisPanel
                index={index}
                spec={spec}
                graphs={graphs}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )

        // console.log(specRows);
      }

      rows.push(
        <Paper key={index}>
          <h3 style={{padding: 15+'px'}}>{index.toUpperCase()}</h3>
          <IndexAnalysisPanel
            specRows={specRows}
          />
        </Paper>
      )
    }

    var formattedJob = (
      <div>
        {rows}
      </div>
    )
    this.setState({ formattedJob: formattedJob })
  }

  // formatCompare = (props) => {
  //   var formattedJobToCompare = (
  //     <div>
  //       <h4>
  //         {props.input.sitename}
  //       </h4>
  //
  //       {/*<p>{job.type.toUpperCase()}&nbsp;&nbsp;&nbsp;&nbsp;{job.input}&nbsp;&nbsp;&nbsp;&nbsp;{job.status}</p>*/}
  //       <p>{props.type.toUpperCase()}</p>
  //       <p>{props.spec.alias}</p>
  //     </div>
  //   )
  //   this.setState({ formattedJobToCompare: formattedJobToCompare })
  // }

  render() {

    let { errorMode, formattedJob } = this.state;

    return (
      <div>
        { errorMode ?
          <div>
            <p style={{ fontSize:24+'px', marginTop:10 }}>An error occurred, passed results are null</p>
          </div>
          :
          <div>
            {formattedJob}
          </div>
        }
      </div>
    );
  }
}

export default AnalysisView;
