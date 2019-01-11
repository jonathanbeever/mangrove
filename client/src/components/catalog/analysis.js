import React, { Component } from 'react';
import NDSICharts from './infographs/NDSICharts';
import ACILineChart from './infographs/ACILineChart';
import ADILineChart from './infographs/ADILineChart';
import AEILineChart from './infographs/AEILineChart';
import ADIAEICharts from './infographs/ADIAEICharts';
import BAAreaChart from './infographs/BAAreaChart';
import CompareACIData from './infographs/CompareACIData';
import CompareBioData from './infographs/CompareBioData';
import OutlierLineChart from './infographs/OutlierLineChart';
import CompareNDSIData from './infographs/CompareNDSIData';
import BALineChart from './infographs/BALineChart';

function convertNDSIResults(jobs) {
  let ret;

  if(jobs.length === 1)
  {
    let results = jobs[0].results;
    ret = {
      graph1: [
                { name: 'Left Channel',
                  ndsi: results.ndsiL,
                  biophony: results.biophonyL,
                  anthrophony: results.anthrophonyL
                },
                { name: 'Right Channel',
                  ndsi: results.ndsiR,
                  biophony: results.biophonyR,
                  anthrophony: results.anthrophonyR
                }
              ],
      graph2: [
                { name: 'NDSI',
                  leftChannel: results.ndsiL,
                  rightChannel: results.ndsiR
                },
                { name: 'Biophony',
                  leftChannel: results.biophonyL,
                  rightChannel: results.biophonyR
                },
                {
                  name: 'Anthrophony',
                  leftChannel: results.anthrophonyL,
                  rightChannel: results.anthrophonyR
                }
              ],
      graph3: []
    }

  }else
  {
    let ndsiLTotal = 0;
    let ndsiRTotal = 0;
    let biophonyLTotal = 0;
    let biophonyRTotal = 0;
    let anthrophonyLTotal = 0;
    let anthrophonyRTotal = 0;

    jobs.forEach(function(job){
      ndsiLTotal += job.results.ndsiL;
      ndsiRTotal += job.results.ndsiR;
      biophonyLTotal += job.results.biophonyL;
      biophonyRTotal += job.results.biophonyR;
      anthrophonyLTotal += job.results.anthrophonyL;
      anthrophonyRTotal += job.results.anthrophonyR;
    });

    let ndsiLAvg = ndsiLTotal / jobs.length;
    let ndsiRAvg = ndsiRTotal / jobs.length;
    let biophonyLAvg = biophonyLTotal / jobs.length;
    let biophonyRAvg = biophonyRTotal / jobs.length;
    let anthrophonyLAvg = anthrophonyLTotal / jobs.length;
    let anthrophonyRAvg = anthrophonyRTotal / jobs.length;

    ret = {
      graph1: [
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
      graph2: [
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
      graph3: []
    }

    for(var i = 0; i < jobs.length; i++)
    {
      let curObject = {
        name: jobs[i].time,
        ndsiL: jobs[i].results.ndsiL,
        ndsiR: jobs[i].results.ndsiR,
        biophonyL: jobs[i].results.biophonyL,
        biophonyR: jobs[i].results.biophonyR,
        anthrophonyL: jobs[i].results.anthrophonyL,
        anthrophonyR: jobs[i].results.anthrophonyR
      }

      ret.graph3.push(curObject);
    }
  }

  return ret;
}

function convertACIResults(jobs) {
  let ret;

  if(jobs.length === 1)
  {
    let results = jobs[0].results;
    ret = {
      graph1: [],
      graph2:
      [
        {
          name: 'ACI Total Left Channel',
          data: results.aciTotAllL
        },
        {
          name: 'ACI Total Right Channel',
          data: results.aciTotAllR
        },
        {
          name: 'ACI Total By Minutes Left Channel',
          data: results.aciTotAllByMinL
        },
        {
          name: 'ACI Total By Minutes Right Channel',
          data: results.aciTotAllByMinR
        }
      ],
      graph3: []
    }

    for(var i = 0; i < results.aciFlValsL.length; i++)
    {
      let curObject =
      {
        name: ((i + 1) * 5).toString(),
        aciLeft: results.aciFlValsL[i],
        aciRight: results.aciFlValsR[i]
      }

      ret.graph1.push(curObject);
    }

  }else
  {
    let aciTotAllL = 0;
    let aciTotAllR = 0;
    let aciTotAllByMinL = 0;
    let aciTotAllByMinR = 0;

    let aciFlValsL = [];
    let aciFlValsR = [];

    jobs.forEach(function(job){
      aciTotAllL += job.results.aciTotAllL;
      aciTotAllR += job.results.aciTotAllR;
      aciTotAllByMinL += job.results.aciTotAllByMinL;
      aciTotAllByMinR += job.results.aciTotAllByMinR;

      aciFlValsL.push.apply(aciFlValsL, job.results.aciFlValsL);
      aciFlValsR.push.apply(aciFlValsR, job.results.aciFlValsR);
    });

    ret = {
      graph1: [],
      graph2:
      [
        {
          name: 'ACI Total Left Channel',
          data: aciTotAllL
        },
        {
          name: 'ACI Total Right Channel',
          data: aciTotAllR
        },
        {
          name: 'ACI Total By Minutes Left Channel',
          data: aciTotAllByMinL
        },
        {
          name: 'ACI Total By Minutes Right Channel',
          data: aciTotAllByMinR
        }
      ],
      graph3: []
    }

    for(var i = 0; i < aciFlValsL.length; i++)
    {
      let curObject =
      {
        name: ((i + 1) * 5).toString(),
        aciLeft: aciFlValsL[i],
        aciRight: aciFlValsR[i]
      }

      ret.graph1.push(curObject);
    }

    for(i = 0; i < jobs.length; i++)
    {
      let curObject =
      {
        name: jobs[i].time,
        aciLeft: jobs[i].results.aciTotAllByMinL,
        aciRight: jobs[i].results.aciTotAllByMinR
      }

      ret.graph3.push(curObject);
    }
  }

  return ret;
}

function convertADIResults(jobs) {
  let ret;

  if(jobs.length === 1)
  {
    let results = jobs[0].results;
    ret = {
      graph1: [],
      graph2: [],
      graph3:
      [
        {
          name: 'ADI Left Channel',
          data: results.adiL
        },
        {
          name: 'ADI Right Channel',
          data: results.adiR
        }
      ],
      graph4: []
    }

    for(var i = 0; i < results.ADIbandRangeL.length; i++)
    {
      let curObject =
      {
        name: results.ADIbandRangeL[i],
        leftBandVal: results.ADIbandValsL[i],
        rightBandVal: results.ADIbandValsR[i]
      }

      ret.graph1.push(curObject);
    }

  }else
  {
    let arrLength = jobs[0].results.ADIbandValsL.length;
    let adiLTotal = 0;
    let adiRTotal = 0;
    let adiLBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);
    let adiRBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);

    jobs.forEach(function(job){
      adiLTotal += job.results.adiL;
      adiRTotal += job.results.adiR;

      adiLBandTemp = adiLBandTemp.map(function(num, idx){
        return num + job.results.ADIbandValsL[idx];
      });

      adiRBandTemp = adiRBandTemp.map(function(num, idx){
        return num + job.results.ADIbandValsR[idx];
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
      graph1: [],
      graph2: [],
      graph3:
      [
        {
          name: 'ADI Left Channel',
          data: adiLAvg
        },
        {
          name: 'ADI Right Channel',
          data: adiRAvg
        }
      ],
      graph4: []
    }

    for(var i = 0; i < adiLBand.length; i++)
    {
      let curObject =
      {
        name: jobs[0].results.ADIbandRangeL[i],
        leftBandVal: adiLBand[i],
        rightBandVal: adiRBand[i]
      }

      ret.graph1.push(curObject);
    }

    for(i = 0; i < jobs.length; i++)
    {
      let curObject =
      {
        name: jobs[i].time,
        leftADIVal: jobs[i].results.adiL,
        rightADIVal: jobs[i].results.adiR
      }

      ret.graph2.push(curObject);
    }

    jobs.forEach(function(job){
      let curObject =
      {
        name: job.name,
        leftADIVal: job.results.adiL,
        rightADIVal: job.results.adiR
      }

      ret.graph4.push(curObject);
    });

  }

  return ret;
}

function convertAEIResults(jobs) {
  let ret;

  if(jobs.length === 1)
  {
    let results = jobs[0].results;
    ret = {
      graph1: [],
      graph2: [],
      graph3:
      [
        {
          name: 'AEI Left Channel',
          data: results.aeiL
        },
        {
          name: 'AEI Right Channel',
          data: results.aeiR
        }
      ],
      graph4: []
    }

    for(var i = 0; i < results.AEIbandRangeL.length; i++)
    {
      let curObject =
      {
        name: results.AEIbandRangeL[i],
        leftBandVal: results.AEIbandValsL[i],
        rightBandVal: results.AEIbandValsR[i]
      }

      ret.graph1.push(curObject);
    }

  }else
  {
    let arrLength = jobs[0].results.AEIbandValsL.length;
    let aeiLTotal = 0;
    let aeiRTotal = 0;
    let aeiLBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);
    let aeiRBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);

    jobs.forEach(function(job){
      aeiLTotal += job.results.aeiL;
      aeiRTotal += job.results.aeiR;

      aeiLBandTemp = aeiLBandTemp.map(function(num, idx){
        return num + job.results.AEIbandValsL[idx];
      });

      aeiRBandTemp = aeiRBandTemp.map(function(num, idx){
        return num + job.results.AEIbandValsR[idx];
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
      graph1: [],
      graph2: [],
      graph3:
      [
        {
          name: 'AEI Left Channel',
          data: aeiLAvg
        },
        {
          name: 'AEI Right Channel',
          data: aeiRAvg
        }
      ],
      graph4: []
    }

    for(var i = 0; i < aeiLBand.length; i++)
    {
      let curObject =
      {
        name: jobs[0].results.AEIbandRangeL[i],
        leftBandVal: aeiLBand[i],
        rightBandVal: aeiRBand[i]
      }

      ret.graph1.push(curObject);
    }

    for(i = 0; i < jobs.length; i++)
    {
      let curObject =
      {
        name: jobs[i].time,
        leftAEIVal: jobs[i].results.aeiL,
        rightAEIVal: jobs[i].results.aeiR
      }

      ret.graph2.push(curObject);
    }

    jobs.forEach(function(job){
      let curObject =
      {
        name: job.name,
        leftAEIVal: job.results.aeiL,
        rightAEIVal: job.results.aeiR
      }

      ret.graph4.push(curObject);
    });
  }

  return ret;
}

function convertBAResults(jobs) {
  let ret;

  if(jobs.length === 1)
  {
    let results = jobs[0].results;
    ret = {
      graph1: [],
      graph2:
      [
        {
          name: 'Left Channel Area',
          data: results.areaL
        },
        {
          name: 'Right Channel Area',
          data: results.areaR
        }
      ],
      graph3: []
    }

    for(var i = 0; i < results.freq_vals.length; i++)
    {
      let curObject =
      {
        name: results.freq_vals[i],
        leftSpectrum: results.left_vals[i],
        rightSpectrum: results.right_vals[i]
      }

      ret.graph1.push(curObject);
    }

  }else
  {
    let areaLTotal = 0;
    let areaRTotal = 0;

    jobs.forEach(function(job){
      areaLTotal += job.results.areaL;
      areaRTotal += job.results.areaR;
    });

    ret = {
      graph1: [],
      graph2:
      [
        {
          name: 'Left Channel Area',
          data: areaLTotal
        },
        {
          name: 'Right Channel Area',
          data: areaRTotal
        }
      ],
      graph3: []
    }

    for(var i = 0; i < jobs.length; i++)
    {
      let curObject = {
        name: jobs[i].name,
        areaL: jobs[i].results.areaL,
        areaR: jobs[i].results.areaR
      }

      ret.graph3.push(curObject);
    }
  }

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
      name: jobs[i].time,
      leftADIVal: jobs[i].results.adiL,
      rightADIVal: jobs[i].results.adiR,
      leftAEIVal: jobs[i].results.aeiL,
      rightAEIVal: jobs[i].results.aeiR
    }

    ret.graph1.push(curObject);
  }

  jobs.forEach(function(job){
    let curObject =
    {
      name: job.name,
      leftADIVal: job.results.adiL,
      rightADIVal: job.results.adiR,
      leftAEIVal: job.results.aeiL,
      rightAEIVal: job.results.aeiR
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
      name: jobs[i].date,
      leftData: jobs[i].results.aciTotAllByMinL,
      rightData: jobs[i].results.aciTotAllByMinR
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
      name: jobs[i].site,
      leftData: jobs[i].results.aciTotAllByMinL,
      rightData: jobs[i].results.aciTotAllByMinR
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
      name: jobs[i].date,
      areaL: jobs[i].results.areaL,
      areaR: jobs[i].results.areaR
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
      name: jobs[i].site,
      areaL: jobs[i].results.areaL,
      areaR: jobs[i].results.areaR
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
        name: jobs[i].date,
        ndsiL: jobs[i].results.ndsiL,
        ndsiR: jobs[i].results.ndsiR
      }
    }else if(value === 'biophony')
    {
      curObject = {
        name: jobs[i].date,
        biophonyL: jobs[i].results.biophonyL,
        biophonyR: jobs[i].results.biophonyR
      }
    }else if(value === 'anthrophony')
    {
      curObject = {
        name: jobs[i].date,
        anthrophonyL: jobs[i].results.anthrophonyL,
        anthrophonyR: jobs[i].results.anthrophonyR
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
        name: jobs[i].site,
        ndsiL: jobs[i].results.ndsiL,
        ndsiR: jobs[i].results.ndsiR
      }
    }else if(value === 'biophony')
    {
      curObject = {
        name: jobs[i].site,
        biophonyL: jobs[i].results.biophonyL,
        biophonyR: jobs[i].results.biophonyR
      }
    }else if(value === 'anthrophony')
    {
      curObject = {
        name: jobs[i].site,
        anthrophonyL: jobs[i].results.anthrophonyL,
        anthrophonyR: jobs[i].results.anthrophonyR
      }
    }

    ret.push(curObject);
  }

  return ret;
}

function convertOutlierResults(jobs) {
  let ret = {
    graph1: [],
    index: jobs[0].index[0]
  }

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject = {
      name: jobs[i].name,
      leftData: 0,
      rightData: 0
    }

    if(ret.index === 'ACI')
    {
      curObject.leftData = jobs[i].results.aciTotAllByMinL;
      curObject.rightData = jobs[i].results.aciTotAllByMinR;
    }else if(ret.index === 'Bioacoustic')
    {
      curObject.leftData = jobs[i].results.areaL;
      curObject.rightData = jobs[i].results.areaR;
    }

    ret.graph1.push(curObject);
  }

  return ret;
}

class AnalysisView extends Component {

  render() {
    const chosenResult = this.props.chosenResult;
    let content;
    let results;

    if(chosenResult === null) {
      content = (
        <div>
          <h5>Select a result to display below</h5>
        </div>
      )
    }else {
      if(chosenResult.index.includes('NDSI'))
      {
        results = convertNDSIResults(chosenResult.jobs);
        content = (
          <div>
            <h3>{chosenResult.name}</h3>
            <NDSICharts results = {results} />
          </div>
        );
      }else if(chosenResult.index.includes('ACI'))
      {
        results = convertACIResults(chosenResult.jobs);
        if(results.graph3.length === 0)
        {
          content = (
            <div>
              <h3>{chosenResult.name}</h3>
              <h5>ACI Totals:</h5>
              <h5>{results.graph2[0].name} - {results.graph2[0].data}</h5>
              <h5>{results.graph2[1].name} - {results.graph2[1].data}</h5>
              <h5>{results.graph2[2].name} - {results.graph2[2].data}</h5>
              <h5>{results.graph2[3].name} - {results.graph2[3].data}</h5>
              <br />
              <ACILineChart results = {results.graph1}
                            xAxisLabel = {"Time (s)"}
                            yAxisLabel = {"ACI Value"}
                            dataKey1 = {'aciLeft'}
                            dataKey2 = {'aciRight'} />
            </div>
          )
        }else
        {
          content = (
            <div>
              <h3>{chosenResult.name}</h3>
              <h5>ACI Totals:</h5>
              <h5>{results.graph2[0].name} - {results.graph2[0].data}</h5>
              <h5>{results.graph2[1].name} - {results.graph2[1].data}</h5>
              <h5>{results.graph2[2].name} - {results.graph2[2].data}</h5>
              <h5>{results.graph2[3].name} - {results.graph2[3].data}</h5>
              <br />
              <ACILineChart results = {results.graph1}
                            xAxisLabel = {"Time (s)"}
                            yAxisLabel = {"ACI Value"}
                            dataKey1 = {'aciLeft'}
                            dataKey2 = {'aciRight'} />
              <ACILineChart results = {results.graph3}
                            xAxisLabel = {"Hour of Day"}
                            yAxisLabel = {"ACI Value"}
                            dataKey1 = {'aciLeft'}
                            dataKey2 = {'aciRight'} />
            </div>
          )
        }
      }else if(chosenResult.index.includes('ADI'))
      {
        if(chosenResult.index.includes('AEI'))
        {
          // this means they have calculated both ADI and AEI
          // we can do cooler stuff with this
          let compareResults = convertADIAEICompare(chosenResult.jobs);
          let adiResults = convertADIResults(chosenResult.jobs);
          let aeiResults = convertAEIResults(chosenResult.jobs);
          content = (
            <div>
              <h3>{chosenResult.name}</h3>
              <ADILineChart results = {adiResults} />
              <AEILineChart results = {aeiResults} />
              <ADIAEICharts results = {compareResults}
                            adiResults = {adiResults}
                            aeiResults = {aeiResults} />
            </div>
          )

        }else
        {
          results = convertADIResults(chosenResult.jobs);
          content = (
            <div>
              <h3>{chosenResult.name}</h3>
              <ADILineChart results = {results} />
            </div>
          )
        }
      }else if(chosenResult.index.includes('AEI'))
      {
        if(chosenResult.index.includes('ADI'))
        {
          // this means they have calculated both ADI and AEI
          // we can do cooler stuff with this
          let compareResults = convertADIAEICompare(chosenResult.jobs);
          let adiResults = convertADIResults(chosenResult.jobs);
          let aeiResults = convertAEIResults(chosenResult.jobs);
          content = (
            <div>
              <h3>{chosenResult.name}</h3>
              <ADILineChart results = {adiResults} />
              <AEILineChart results = {aeiResults} />
              <ADIAEICharts results = {compareResults}
                            adiResults = {adiResults}
                            aeiResults = {aeiResults} />
            </div>
          )

        }else
        {
          results = convertAEIResults(chosenResult.jobs);
          content = (
            <div>
              <h3>{chosenResult.name}</h3>
              <AEILineChart results = {results} />
            </div>
          )
        }
      }else if(chosenResult.index.includes('Bioacoustic'))
      {
        results = convertBAResults(chosenResult.jobs);

        if(results.graph3.length === 0)
        {
          content = (
            <div>
              <h3>{chosenResult.name}</h3>
              <h5>{results.graph2[0].name}: {results.graph2[0].data}</h5>
              <h5>{results.graph2[1].name}: {results.graph2[1].data}</h5>
              <br />
              <BAAreaChart results = {results.graph1}
                            xAxisLabel = {"Hz Range"}
                            yAxisLabel = {"Spectrum Value"}
                            dataKey1 = {'leftSpectrum'}
                            dataKey2 = {'rightSpectrum'}
                          />
            </div>
          )
        }else
        {
          content = (
            <div>
              <h3>{chosenResult.name}</h3>
              <h5>Bioacoustic Area Values:</h5>
              <h5>{results.graph2[0].name} - {results.graph2[0].data}</h5>
              <h5>{results.graph2[1].name} - {results.graph2[1].data}</h5>
              <br />
              <BALineChart results = {results.graph3}
                          xAxisLabel = {"File Name"}
                          yAxisLabel = {"Area Value"}
                          />
            </div>
          )
        }
      }else if(chosenResult.index.includes('Test ACI'))
      {
        results = convertCompareACIResults(chosenResult.jobs);
        content = (
          <div>
            <h5>Comparing ACI Results</h5>
            <CompareACIData results = {results} />
          </div>
        )
      }else if(chosenResult.index.includes('Test Bioacoustic'))
      {
        results = convertCompareBioResults(chosenResult.jobs);
        content = (
          <div>
            <h5>Comparing Bioacoustic Results</h5>
            <CompareBioData results = {results} />
          </div>
        )
      }else if(chosenResult.index.includes('Test Outliers'))
      {
        results = convertOutlierResults(chosenResult.jobs);
        content = (
          <div>
            <OutlierLineChart results = {results.graph1}
                              index = {results.index}
                              xAxisLabel = 'File Name'
                              yAxisLabel = {results.index + ' Value'}/>
          </div>
        )
      }else if(chosenResult.index.includes('Test NDSI'))
      {
        results = convertCompareNDSIResults(chosenResult.jobs);
        content = (
          <div>
            <CompareNDSIData results = {results} />
          </div>
        )
      }
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

export default AnalysisView;
