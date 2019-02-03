import React, { Component } from 'react';
import {LineChart, Line, Brush, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


class NDSIValuesLineChart extends Component {

  render(){

    let { results, xAxisLabel } = this.props;

    return(
      <div>
        <LineChart width={900} height={600} data={results}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey='name' label={xAxisLabel}/>
          <YAxis label='Value'/>
          <Legend />
          <Tooltip/>
          <Line type='natural' dataKey='biophonyL' stroke='#8884d8' dot={false} />
          <Line type='natural' dataKey='biophonyR' stroke='#5551a2' dot={false} />
          <Line type='natural' dataKey='anthrophonyL' stroke='#257142' dot={false} />
          <Line type='natural' dataKey='anthrophonyR' stroke='#82ca9d' dot={false} />
          <Brush syncId="2"/>
        </LineChart>
      </div>
    )
  }
}

export default NDSIValuesLineChart;
