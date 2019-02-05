import React, { Component } from 'react';
import Recharts, {LineChart, Label, Line, Brush, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


class NDSIChannelLineChart extends Component {

  render(){

    let data = this.props.results;

    return(
      <div>
        <LineChart width={900} height={600} data={data}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name">
            <Label value="Hour of Day" position="insideBottom" offset={2} />
          </XAxis>
          <YAxis domain={['dataMin-1', 'dataMax+1']}>
            <Label value="Value" position="insideLeft" offset={0} />
          </YAxis>
          <Legend />
          <Tooltip/>
          <Line type='monotone' dataKey='ndsiL' stroke='#8884d8' dot={false} />
          <Line type='monotone' dataKey='ndsiR' stroke='#82ca9d' dot={false} />
          <Brush />
        </LineChart>
      </div>
    )
  }
}

export default NDSIChannelLineChart;
