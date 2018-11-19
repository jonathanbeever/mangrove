import React, {Component} from 'react';
import Recharts, {AreaChart, Brush, Legend, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class BAAreaChart extends Component {

  render(){
    let data = this.props.results;

    let xLabel = this.props.xAxisLabel;
    let yLabel = this.props.yAxisLabel;

    let firstDataKey = this.props.dataKey1;
    let secondDataKey = this.props.dataKey2;

    return(
      <div>
        <AreaChart width={900} height={600} data={data} >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name" label={xLabel}/>
          <Legend />
          <YAxis label={yLabel} domain={['dataMin', 'dataMax']} />
          <Tooltip/>
          <Area type='monotone' dataKey={firstDataKey} stackId="1" stroke='#8884d8' fill='#8884d8' />
          <Brush />
        </AreaChart>
        <AreaChart width={900} height={600} data={data} >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name" label={xLabel}/>
          <Legend />
          <YAxis label={yLabel} domain={['dataMin', 'dataMax']} />
          <Tooltip/>
          <Area type='monotone' dataKey={secondDataKey} stackId="1" stroke='#82ca9d' fill='#82ca9d' />
          <Brush />
        </AreaChart>
      </div>
    );
  }
}

export default BAAreaChart;
