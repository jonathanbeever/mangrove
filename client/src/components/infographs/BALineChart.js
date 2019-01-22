import React, { Component } from 'react';
import {LineChart, Line, Legend, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class BALineChart extends Component {

  render(){

    return(
      <div>
          <LineChart width={900} height={600} data={this.props.results} syncId="anyId">
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey='name' label={this.props.xAxisLabel}/>
            <YAxis label={this.props.yAxisLabel}/>
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
