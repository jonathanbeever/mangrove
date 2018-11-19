import React, {Component} from 'react';
import Recharts, {AreaChart, Brush, Legend, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import BAAreaChart from './infographs/BAAreaChart';

class CompareBioData extends Component {

  render(){
    let graphs = this.props.results;
    let graph1 = graphs.graph1;
    let graph2 = graphs.graph2;

    return(
      <div>
        <h5>Comparing Bioacoustic Area Over Time</h5>
        <BAAreaChart results = {graphs1}
                    xAxisLabel = {"Date"}
                    yAxisLabel = {"Area Value"}
                    dataKey1 = {'areaL'}
                    dataKey2 = {'areaR'}
                    />
        <h5>Comparing Bioacoustic Area By Site</h5>
        <BAAreaChart results = {graphs2}
                    xAxisLabel = {"Site"}
                    yAxisLabel = {"Area Value"}
                    dataKey1 = {'areaL'}
                    dataKey2 = {'areaR'}
                    />
      </div>
    );
  }
}

export default CompareBioData;
