import React, {Component} from 'react';
import NDSILineChart from './NDSILineChart';
import NDSICompareChart from './NDSICompareChart';

class CompareNDSIData extends Component {

  render(){
    let graphs = this.props.results;
    let graph1 = graphs.graph1;
    let graph2 = graphs.graph2;
    let graph3 = graphs.graph3;
    let graph4 = graphs.graph4;
    let graph5 = graphs.graph5;
    let graph6 = graphs.graph6;

    return(
      <div>
        <h5>Comparing NDSI Over Time</h5>
        <NDSICompareChart results = {graph1}
                    xAxisLabel = {"Date"}
                    yAxisLabel = {"NDSI Value"}
                    dataKey1 = {'ndsiL'}
                    dataKey2 = {'ndsiR'}
                    />
        <h5>Comparing NDSI By Site</h5>
        <NDSICompareChart results = {graph2}
                    xAxisLabel = {"Site"}
                    yAxisLabel = {"NDSI Value"}
                    dataKey1 = {'ndsiL'}
                    dataKey2 = {'ndsiR'}
                    />
        <h5>Comparing Biophony Over Time</h5>
        <NDSICompareChart results = {graph3}
                    xAxisLabel = {"Date"}
                    yAxisLabel = {"Biophony Value"}
                    dataKey1 = {'biophonyL'}
                    dataKey2 = {'biophonyR'}
                    />
        <h5>Comparing Biophony By Site</h5>
        <NDSICompareChart results = {graph4}
                    xAxisLabel = {"Site"}
                    yAxisLabel = {"Biophony Value"}
                    dataKey1 = {'biophonyL'}
                    dataKey2 = {'biophonyR'}
                    />
        <h5>Comparing Anthrophony Over Time</h5>
        <NDSICompareChart results = {graph5}
                    xAxisLabel = {"Date"}
                    yAxisLabel = {"Anthrophony Value"}
                    dataKey1 = {'anthrophonyL'}
                    dataKey2 = {'anthrophonyR'}
                    />
        <h5>Comparing Anthrophony By Site</h5>
        <NDSICompareChart results = {graph6}
                    xAxisLabel = {"Site"}
                    yAxisLabel = {"Anthrophony Value"}
                    dataKey1 = {'anthrophonyL'}
                    dataKey2 = {'anthrophonyR'}
                    />
      </div>
    );
  }
}

export default CompareNDSIData;
