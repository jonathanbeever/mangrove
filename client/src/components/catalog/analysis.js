import React, { Component } from 'react';
import NDSIBarChart from './infographs/NDSIBarChart';
import ACILineChart from './infographs/ACILineChart';
import ADILineChart from './infographs/ADILineChart';
import BAAreaChart from './infographs/BAAreaChart';

function convertNDSIResults(results) {
  let ret = {
    graph1: [
              { name: 'Left Channel',
                ndsi: results.ndsi_left,
                biophony: results.biophony_left,
                anthrophony: results.anthrophony_left
              },
              { name: 'Right Channel',
                ndsi: results.ndsi_right,
                biophony: results.biophony_right,
                anthrophony: results.anthrophony_right
              }
            ],
    graph2: [
              { name: 'NDSI',
                leftChannel: results.ndsi_left,
                rightChannel: results.ndsi_right
              },
              { name: 'Biophony',
                leftChannel: results.biophony_left,
                rightChannel: results.biophony_right
              },
              {
                name: 'Anthrophony',
                leftChannel: results.anthrophony_left,
                rightChannel: results.anthrophony_right
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
        data: results.aciTotAll_left
      },
      {
        name: 'ACI Total Right Channel',
        data: results.aciTotAll_right
      },
      {
        name: 'ACI Total By Minutes Left Channel',
        data: results.aciByMin_left
      },
      {
        name: 'ACI Total By Minutes Right Channel',
        data: results.aciByMin_right
      }
    ]
  }

  for(var i = 0; i < results.aci_fl_left_vals.length; i++)
  {
    let curObject =
    {
      name: ((i + 1) * 5).toString(),
      leftData: results.aci_fl_left_vals[i],
      rightData: results.aci_fl_right_vals[i]
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
        data: results.adi_left
      },
      {
        name: 'ADI Right Channel',
        data: results.adi_right
      }
    ]
  }

  for(var i = 0; i < results.left_band_values.length; i++)
  {
    let curObject =
    {
      name: results.bandrange_values[i],
      leftBandVal: results.left_band_values[i],
      rightBandVal: results.right_band_values[i]
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
        data: results.left_area
      },
      {
        name: 'Right Channel Area',
        data: results.right_area
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
            <ACILineChart results = {results} />
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
            <BAAreaChart results = {results} />
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
