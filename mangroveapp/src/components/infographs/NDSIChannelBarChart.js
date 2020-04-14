import React, { Component } from 'react';
import {BarChart, Bar, Label, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


class NDSIChannelBarChart extends Component {

  formatYAxis = (tickItem) => {
    let asF = parseFloat(tickItem);
    return (asF).toFixed(2);
  }

  render(){

    let data = this.props.results;

    return(
      <div>
        <BarChart width={900} height={600} data={data}
          margin={{top: 10, right: 30, left: 30, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" height={45}>
            <Label value="Channel" position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="Variable" position="insideLeft" offset={-30} tickFormatter={this.formatYAxis} />
          </YAxis>
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke='#000' />
          <Bar dataKey="leftChannel" fill="#8884d8" />
          <Bar dataKey="rightChannel" fill="#82ca9d" />
        </BarChart>
      </div>
    )
  }
}

export default NDSIChannelBarChart;
