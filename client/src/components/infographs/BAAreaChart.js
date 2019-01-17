import React, {Component} from 'react';
import Recharts, {AreaChart, Brush, Legend, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class BAAreaChart extends Component {

  render(){

    return(
      <div>
        <AreaChart width={900} height={600} data={this.props.results} >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name" label={this.props.xAxisLabel}/>
          <Legend />
          <YAxis label={this.props.yAxisLabel} domain={['dataMin', 'dataMax']} />
          <Tooltip/>
          <Area type='monotone' dataKey={this.props.dataKey1} stackId="1" stroke='#8884d8' fill='#8884d8' />
          <Brush />
        </AreaChart>
        <AreaChart width={900} height={600} data={this.props.results} >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name" label={this.props.xAxisLabel}/>
          <Legend />
          <YAxis label={this.props.yAxisLabel} domain={['dataMin', 'dataMax']} />
          <Tooltip/>
          <Area type='monotone' dataKey={this.props.dataKey2} stackId="1" stroke='#82ca9d' fill='#82ca9d' />
          <Brush />
        </AreaChart>
      </div>
    );
  }
}

export default BAAreaChart;
