import React, { Component } from 'react';
import NDSIBarChart from './infographs/NDSIBarChart';
import ACILineChart from './infographs/ACILineChart';


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
    graph1:
    [
        {
          name: 'Left Channel',
          data: results.aci_fl_left_vals
        },
        {
          name: 'Right Channel',
          data: results.aci_fl_right_vals
        }
    ],
    graph2:
    [
      {
        name: 'ACI Total Left Channel',
        data: results.aciTotAll_left
      },
      {
        name: 'ACI Total Right Channel',
        data: results.aciTotAll_right
      }
    ]
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
