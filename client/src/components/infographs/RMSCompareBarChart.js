import React, { Component } from 'react';
import {BarChart, Bar, Label, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class RMSCompareBarChart extends Component {

  formatYAxis = (tickItem) => {
    let asF = parseFloat(tickItem);
    return (asF).toFixed(2);
  }

  render(){

    let data = this.props.results.data;

    return(
      <div>
        <h5>RMS Left Channel Total: {this.formatYAxis(this.props.results.avgL)}</h5>
        <h5>RMS Left Channel Compare Total: {this.formatYAxis(this.props.results.avgLC)}</h5>
        <h5>RMS Right Channel Total: {this.formatYAxis(this.props.results.avgR)}</h5>
        <h5>RMS Right Channel Compare Total: {this.formatYAxis(this.props.results.avgRC)}</h5>
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

export default RMSCompareBarChart;
