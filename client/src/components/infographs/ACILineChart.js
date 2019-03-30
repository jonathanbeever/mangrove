import React, { Component } from 'react';
import {LineChart, Line, Label, Legend, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import CustomTooltip from './components/CustomTooltip';

class ACILineChart extends Component {

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
    let data = this.props.results;

    let xLabel = this.props.xAxisLabel;
    let yLabel = this.props.yAxisLabel;

    let firstDataKey = this.props.dataKey1;
    let secondDataKey = this.props.dataKey2;

    let customTooltip = this.props.custom;

    let endOfBrush;
    let len = data.length;
    if(len > 1500) endOfBrush = 1500;
    else endOfBrush = len;

    return(
      <div>
        <div>
          <h5>To listen to a sound file at the time shown, simply click on a datapoint dot, and an audio player will appear.</h5>
          <LineChart width={900} height={600} data={data}
            margin={{top: 10, right: 30, left: 0, bottom: 0}}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name">
              <Label value={xLabel} position="insideBottom" offset={2} />
            </XAxis>
            <YAxis domain={['dataMin-1', 'dataMax+1']} tickFormatter={this.formatYAxis}>
              <Label value={yLabel} position="insideLeft" offset={0} />
            </YAxis>
            <Legend />
            { customTooltip ?
              <Tooltip content={<CustomTooltip/>}/>
              :
              <Tooltip/>}
            <Line activeDot={{ onClick: this.props.audioCallback }} type='monotone' dataKey={firstDataKey} stroke='#8884d8' dot={false} />
            <Line activeDot={{ onClick: this.props.audioCallback }} type='monotone' dataKey={secondDataKey} stroke='#82ca9d' dot={false} />
            <Brush endIndex={endOfBrush - 1} onChange={this.alertBrush} />
          </LineChart>
        </div>
      </div>
    );
  }
}

export default ACILineChart;
