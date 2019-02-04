import React, {Component} from 'react';
import {AreaChart, Brush, Legend, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class BAAreaChart extends Component {

  render(){

    let { results, xAxisLabel, yAxisLabel, dataKey1, dataKey2 } = this.props;

    return(
      <div>
        <AreaChart width={900} height={600} data={results} syncId="bi">
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name" label={xAxisLabel}/>
          <Legend />
          <YAxis label={yAxisLabel} domain={['dataMin', 'dataMax']} />
          <Tooltip/>
          <Area type='monotone' dataKey={dataKey1} stackId="1" stroke='#8884d8' fill='#8884d8' />
          <Brush />
        </AreaChart>
        <AreaChart width={900} height={600} data={results} syncId="bi">
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name" label={xAxisLabel}/>
          <Legend />
          <YAxis label={yAxisLabel} domain={['dataMin', 'dataMax']} />
          <Tooltip/>
          <Area type='monotone' dataKey={dataKey2} stackId="1" stroke='#82ca9d' fill='#82ca9d' />
          <Brush />
        </AreaChart>
      </div>
    );
  }
}

export default BAAreaChart;
