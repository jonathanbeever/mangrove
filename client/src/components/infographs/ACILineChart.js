import React, { Component } from 'react';
import {LineChart, Line, Legend, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class ACILineChart extends Component {

  render(){
    let data = this.props.results;

    let xLabel = this.props.xAxisLabel;
    let yLabel = this.props.yAxisLabel;

    let firstDataKey = this.props.dataKey1;
    let secondDataKey = this.props.dataKey2;

    return(
      <div>
          <LineChart width={900} height={600} data={data} syncId="anyId">
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name" label={xLabel}/>
            <YAxis label={yLabel}/>
            <Legend />
            <Tooltip/>
            <Line type='natural' dataKey={firstDataKey} stroke='#8884d8' dot={false} />
            <Line type='natural' dataKey={secondDataKey} stroke='#82ca9d' dot={false} />
            <Brush />
          </LineChart>
      </div>
    );
  }
}



export default ACILineChart;
