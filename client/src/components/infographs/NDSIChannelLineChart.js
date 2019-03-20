import React, { Component } from 'react';
import Recharts, {LineChart, Label, Line, Brush, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


class NDSIChannelLineChart extends Component {

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

    let endOfBrush;
    let len = data.length;
    if(len > 1000) endOfBrush = Math.floor(len / 100);
    else endOfBrush = len;

    return(
      <div>
        <LineChart width={900} height={600} data={data}
          margin={{top: 10, right: 30, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name">
            <Label value="Hour of Day" position="insideBottom" offset={2} />
          </XAxis>
          <YAxis domain={['dataMin-1', 'dataMax+1']}>
            <Label value="Value" position="insideLeft" offset={0} tickFormatter={this.formatYAxis} />
          </YAxis>
          <Legend />
          <Tooltip/>
          <Line type='monotone' dataKey='ndsiL' stroke='#8884d8' dot={false} />
          <Line type='monotone' dataKey='ndsiR' stroke='#82ca9d' dot={false} />
          <Brush endIndex={endOfBrush - 1} onChange={this.alertBrush}/>
        </LineChart>
      </div>
    )
  }
}

export default NDSIChannelLineChart;
