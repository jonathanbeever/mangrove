import React, { Component } from 'react';
import Recharts, {LineChart, Line, Brush, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


class NDSIChannelLineChart extends Component {

  render(){

    let data = this.props.results;

    return(
      <div>
        <LineChart width={900} height={600} data={data} syncId="1">
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey='name' label='Hour of Day'/>
          <YAxis label='Value'/>
          <Legend />
          <Tooltip/>
          <Line type='natural' dataKey='ndsiL' stroke='#8884d8' dot={false} />
          <Line type='natural' dataKey='ndsiR' stroke='#82ca9d' dot={false} />
          <Brush syncId = "1"/>
        </LineChart>
      </div>
    )
  }
}

export default NDSIChannelLineChart;
