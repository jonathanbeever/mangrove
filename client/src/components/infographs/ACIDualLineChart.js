import React, { Component } from 'react';
import {LineChart, Line, Label, Legend, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class ACIDualLineChart extends Component {

  formatYAxis = (tickItem) => {
    let asF = parseFloat(tickItem);
    return (asF).toFixed(2);
  }

  alertBrush = (indices) => {
    let start = indices.startIndex;
    let end = indices.endIndex;
    if(end - start > 1500){
      if(localStorage.getItem('analysisViewAlert') === true)
      {
        this.props.callback();
      }
    }
  }

  render(){
    let { results, xAxisLabel, yAxisLabel, dataKey1, dataKey2, dataKey3, dataKey4 } = this.props;
    let data = results;
    let endOfBrush;
    let len = data.length;
    if(len > 1500) endOfBrush = 1500;
    else endOfBrush = len;

    return(
      <LineChart width={900} height={600} data={data}
        margin={{top: 10, right: 30, left: 0, bottom: 0}}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="name">
          <Label value={xAxisLabel} position="insideBottom" offset={2} />
        </XAxis>
        <YAxis domain={['dataMin-10', 'dataMax+10']} offset={0} tickFormatter={this.formatYAxis}>
          <Label value={yAxisLabel} position="insideLeft" offset={0} />
        </YAxis>
        <Legend />
        <Tooltip/>
        <Line type='monotone' dataKey={dataKey1} stroke='#8884d8' dot={false} />
        <Line type='monotone' dataKey={dataKey2} stroke='#82ca9d' dot={false} />
        <Line type='monotone' dataKey={dataKey3} stroke='#e79797' dot={false} />
        <Line type='monotone' dataKey={dataKey4} stroke='#ed9f37' dot={false} />
        <Brush endIndex={endOfBrush - 1} onChange={this.alertBrush} />
      </LineChart>
    );
  }
}

export default ACIDualLineChart;
