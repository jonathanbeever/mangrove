import React, { Component } from 'react';
import {BarChart, Bar, Label, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class RMSBarChart extends Component {

  formatYAxis = (tickItem) => {
    let asF = parseFloat(tickItem);
    return (asF).toFixed(2);
  }

  render(){

    let data = this.props.results;

    return(
      <div>
        <BarChart width={900} height={600} data={data}
          margin={{top: 10, right: 30, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name">
            <Label value="File Name" position="insideBottom" offset={2} />
          </XAxis>
          <YAxis>
            <Label value="RMS Value" position="insideLeft" offset={0} tickFormatter={this.formatYAxis} />
          </YAxis>
          <Tooltip />
          <Legend />
          <Bar dataKey="rmsL" fill="#8884d8" />
          <Bar dataKey="rmsR" fill="#82ca9d" />
        </BarChart>
      </div>
    )
  }
}

export default RMSBarChart;
