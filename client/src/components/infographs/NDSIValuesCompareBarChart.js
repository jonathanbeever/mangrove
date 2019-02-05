import React, { Component } from 'react';
import {BarChart, Label, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


class NDSIValuesCompareBarChart extends Component {

  render(){

    let data = this.props.results;

    // console.log(this.props);

    return(
      <div>
        <BarChart width={900} height={600} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name">
            <Label value="Channel" position="insideBottom" offset={2} />
          </XAxis>
          <YAxis>
            <Label value="Variable" position="insideLeft" offset={0} />
          </YAxis>
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke='#000' />
          <Bar dataKey="leftChannel" fill="#8884d8" />
          <Bar dataKey="rightChannelC" fill="#1910d4" />
          <Bar dataKey="rightChannel" fill="#82ca9d" />
          <Bar dataKey="rightChannelC" fill="#108f3f" />
        </BarChart>
      </div>
    )
  }
}

export default NDSIValuesCompareBarChart;
