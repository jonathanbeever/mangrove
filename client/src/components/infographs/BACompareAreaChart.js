import React, {Component} from 'react';
import {AreaChart, Brush, Label, Legend, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class BAAreaChart extends Component {

  render(){

    let { results, xAxisLabel, yAxisLabel, dataKey1, dataKey2, dataKey3, dataKey4 } = this.props;

    return(
      <div>
        <AreaChart width={900} height={600} data={results} syncId="bi-compare">
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name">
            <Label value={xAxisLabel} position="insideBottom" offset={2} />
          </XAxis>
          <Legend />
          <YAxis domain={['dataMin', 'dataMax']}>
            <Label value={yAxisLabel} position="insideLeft" offset={2} />
          </YAxis>
          <Tooltip/>
          <Area type='monotone' dataKey={dataKey1} stackId="1" stroke='#8884d8' fill='#8884d8' />
          <Area type='monotone' dataKey={dataKey3} stackId="2" stroke='#1910d4' fill='#1910d4' />
          <Brush />
        </AreaChart>
        <AreaChart width={900} height={600} data={results} syncId="bi-compare">
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name">
            <Label value={xAxisLabel} position="insideBottom" offset={2} />
          </XAxis>
          <Legend />
          <YAxis domain={['dataMin', 'dataMax']}>
            <Label value={yAxisLabel} position="insideLeft" offset={2} />
          </YAxis>
          <Tooltip/>
          <Area type='monotone' dataKey={dataKey2} stackId="1" stroke='#82ca9d' fill='#82ca9d' />
          <Area type='monotone' dataKey={dataKey4} stackId="2" stroke='#108f3f' fill='#108f3f' />
          <Brush />
        </AreaChart>
      </div>
    );
  }
}

export default BAAreaChart;
