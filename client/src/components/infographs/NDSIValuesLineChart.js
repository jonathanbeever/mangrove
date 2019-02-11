import React, { Component } from 'react';
import {LineChart, Label, Line, Brush, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


class NDSIValuesLineChart extends Component {

  render(){

    let { results, xAxisLabel } = this.props;

    return(
      <div>
        <LineChart width={900} height={600} data={results}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name">
            <Label value={xAxisLabel} position="insideBottom" offset={2} />
          </XAxis>
          <YAxis domain={['dataMin-1', 'dataMax+1']}>
            <Label value="Value" position="insideLeft" offset={0} />
          </YAxis>
          <Legend />
          <Tooltip/>
          <Line type='monotone' dataKey='biophonyL' stroke='#8884d8' dot={false} />
          <Line type='monotone' dataKey='biophonyR' stroke='#5551a2' dot={false} />
          <Line type='monotone' dataKey='anthrophonyL' stroke='#257142' dot={false} />
          <Line type='monotone' dataKey='anthrophonyR' stroke='#82ca9d' dot={false} />
          <Brush />
        </LineChart>
      </div>
    )
  }
}

export default NDSIValuesLineChart;
