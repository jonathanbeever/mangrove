import React, { Component } from 'react';
import {LineChart, Line, Label, Legend, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class ACILineChart extends Component {

  render(){
    let data = this.props.results;

    let xLabel = this.props.xAxisLabel;
    let yLabel = this.props.yAxisLabel;

    let firstDataKey = this.props.dataKey1;
    let secondDataKey = this.props.dataKey2;

    return(
      <div>
          <LineChart width={900} height={600} data={data}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name">
              <Label value={xLabel} position="insideBottom" offset={2} />
            </XAxis>
            <YAxis domain={['dataMin-10', 'dataMax+10']}>
              <Label value={yLabel} position="insideLeft" offset={0} />
            </YAxis>
            <Legend />
            <Tooltip/>
            <Line type='monotone' dataKey={firstDataKey} stroke='#8884d8' dot={false} />
            <Line type='monotone' dataKey={secondDataKey} stroke='#82ca9d' dot={false} />
            <Brush />
          </LineChart>
      </div>
    );
  }
}



export default ACILineChart;
