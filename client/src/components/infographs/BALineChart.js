import React, { Component } from 'react';
import {LineChart, Line, Legend, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class BALineChart extends Component {

  render(){

    let { results, xAxisLabel, yAxisLabel } = this.props;

    return(
      <div>
          <LineChart width={900} height={600} data={results}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey='name' label={xAxisLabel}/>
            <YAxis label={yAxisLabel}/>
            <Legend />
            <Tooltip/>
            <Line type='natural' dataKey='areaL' stroke='#8884d8' dot={false} />
            <Line type='natural' dataKey='areaR' stroke='#82ca9d' dot={false} />
            <Brush />
          </LineChart>
      </div>
    );
  }
}



export default BALineChart;
