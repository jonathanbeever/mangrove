import React, { Component } from 'react';
import NDSIBarChart from './infographs/NDSIBarChart';
import ACILineChart from './infographs/ACILineChart';
import ADILineChart from './infographs/ADILineChart';
import BAAreaChart from './infographs/BAAreaChart';
import CompareACIData from './infographs/CompareACIData';
import CompareBioData from './infographs/CompareBioData';
import OutlierLineChart from './infographs/OutlierLineChart';

function convertNDSIResults(results) {
  let ret = {
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
            ]
  }
  return ret;
}

function convertACIResults(results) {
  let ret = {
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
    ]
  }

  for(var i = 0; i < results.aciFlValsL.length; i++)
  {
    let curObject =
    {
      name: ((i + 1) * 5).toString(),
      leftData: results.aciFlValsL[i],
      rightData: results.aciFlValsR[i]
    }

    ret.graph1.push(curObject);
  }

  return ret;
}

function convertADIResults(results) {
  let ret = {
    graph1: [],
    graph2:
    [
      {
        name: 'ADI Left Channel',
        data: results.adiL
      },
      {
        name: 'ADI Right Channel',
        data: results.adiR
      }
    ]
  }

  for(var i = 0; i < results.bandL.length; i++)
  {
    let curObject =
    {
      name: results.bandRangeL[i],
      leftBandVal: results.bandL[i],
      rightBandVal: results.bandR[i]
    }

    ret.graph1.push(curObject);
  }

  return ret;
}

function convertBAResults(results) {
  let ret = {
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
    ]
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

  return ret;
}

function convertCompareACIResults(results) {
  let ret = {
    graph1: convertCompareACIResultsOverTime(results),
    graph2: convertCompareACIResultsOverSite(results)
  }

  return ret;
}

function convertCompareACIResultsOverTime(results) {
  let ret = [];

  for(var i = 0; i < results.length; i++)
  {
    let curObject =
    {
      name: results[i].date,
      leftData: results[i].results.aciTotAllByMinL,
      rightData: results[i].results.aciTotAllByMinR
    }

    ret.push(curObject);
  }

  return ret;
}

function convertCompareACIResultsOverSite(results) {
  let ret = [];

  for(var i = 0; i < results.length; i++)
  {
    let curObject =
    {
      name: results[i].site,
      leftData: results[i].results.aciTotAllByMinL,
      rightData: results[i].results.aciTotAllByMinR
    }

    ret.push(curObject);
  }

  return ret;
}

function convertCompareBioResults(results) {
  let ret = {
    graph1: convertCompareBioResultsOverTime(results),
    graph2: convertCompareBioResultsOverSite(results)
  }

  return ret;
}

function convertCompareBioResultsOverTime(results) {
  let ret = [];

  for(var i = 0; i < results.length; i++)
  {
    let curObject =
    {
      name: results[i].date,
      areaL: results[i].areaL,
      areaR: results[i].areaR
    }

    ret.push(curObject);
  }

  return ret;
}

function convertCompareBioResultsOverSite(results) {
  let ret = [];

  for(var i = 0; i < results.length; i++)
  {
    let curObject =
    {
      name: results[i].site,
      areaL: results[i].areaL,
      areaR: results[i].areaR
    }

    ret.push(curObject);
  }

  return ret;
}

function convertOutlierResults(results) {
  let ret = {
    graph1: []
  }

  for(var i = 0; i < results.results.length; i++)
  {

  }
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
        results = convertNDSIResults(chosenResult.results);
        content = (
          <div>
            <h5>{chosenResult.name}</h5>
            <NDSIBarChart results = {results} />
          </div>
        );
      }else if(chosenResult.index.includes('ACI'))
      {
        results = convertACIResults(chosenResult.results);
        content = (
          <div>
            <h5>{chosenResult.name}</h5>
            <h3>ACI Totals:</h3>
            <h5>{results.graph2[0].name} - {results.graph2[0].data}</h5>
            <h5>{results.graph2[1].name} - {results.graph2[1].data}</h5>
            <h5>{results.graph2[2].name} - {results.graph2[2].data}</h5>
            <h5>{results.graph2[3].name} - {results.graph2[3].data}</h5>
            <br />
            <ACILineChart results = {results.graph1} xAxisLabel = {"Time (s)"} yAxisLabel = {"ACI Value"}/>
          </div>
        )
      }else if(chosenResult.index.includes('ADI'))
      {
        if(chosenResult.index.includes('AEI'))
        {
          // this means they have calculated both ADI and AEI
          // we can do cooler stuff with this



        }else
        {
          results = convertADIResults(chosenResult.results);
          content = (
            <div>
              <h5>{chosenResult.name}</h5>
              <ADILineChart results = {results} />
            </div>
          )
        }
      }else if(chosenResult.index.includes('Bioacoustic'))
      {
        results = convertBAResults(chosenResult.results);
        content = (
          <div>
            <h5>{chosenResult.name}</h5>
            <h3>Bioacoustic Area Values:</h3>
            <h5>{results.graph2[0].name} - {results.graph2[0].data}</h5>
            <h5>{results.graph2[1].name} - {results.graph2[1].data}</h5>
            <br />
            <BAAreaChart results = {results.graph1}
                          xAxisLabel = {"Hz Range"}
                          yAxisLabel = {"Spectrum Value"}
                          dataKey1 = {'leftSpectrum'}
                          dataKey2 = {'rightSpectrum'}
                        />
          </div>
        )
      }else if(chosenResult.index.includes('Test ACI'))
      {
        results = convertCompareACIResults(chosenResult.results);
        content = (
          <div>
            <h4>Comparing ACI Results</h4>
            <CompareACIData results = {results} />
          </div>
        )
      }else if(chosenResult.index.includes('Test Bioacoustic'))
      {
        results = convertCompareBioResults(chosenResult.results);
        content = (
          <div>
            <h4>Comparing Bioacoustic Results</h4>
            <CompareBioData results = {results} />
          </div>
        )
      }else if(chosenResult.index.includes('Test Outliers'))
      {
        results = convertOutlierResults(chosenResult.results);
        content = (
          <div>
            <OutlierLineChart />
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
