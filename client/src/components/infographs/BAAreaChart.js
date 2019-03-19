import React, {Component} from 'react';
import {AreaChart, Brush, Label, Legend, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class BAAreaChart extends Component {

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

    let { results, xAxisLabel, yAxisLabel, dataKey1, dataKey2 } = this.props;

    let endOfBrush;
    let len = results.length;
    if(len > 1500) endOfBrush = 1500;
    else endOfBrush = len;

    return(
      <div>
        <AreaChart width={900} height={600} data={results} syncId="bi"
          margin={{top: 10, right: 30, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name">
            <Label value={xAxisLabel} position="insideBottom" offset={2} />
          </XAxis>
          <Legend />
          <YAxis domain={['dataMin', 'dataMax']}>
            <Label value={yAxisLabel} position="insideLeft" offset={2}  tickFormatter={this.formatYAxis}/>
          </YAxis>
          <Tooltip/>
          <Area type='monotone' dataKey={dataKey1} stackId="1" stroke='#8884d8' fill='#8884d8' />
          <Area type='monotone' dataKey={dataKey2} stackId="2" stroke='#82ca9d' fill='#82ca9d' />
          <Brush endIndex={endOfBrush - 1} onChange={this.alertBrush}>
            <Area type='monotone' dataKey={dataKey1} stackId="1" stroke='#8884d8' fill='#8884d8' />
            <Area type='monotone' dataKey={dataKey2} stackId="2" stroke='#82ca9d' fill='#82ca9d' />
          </Brush>
        </AreaChart>
      </div>
    );
  }
}

export default BAAreaChart;
