import React, { Component } from 'react';
import {LineChart, Line, Label, Legend, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class ACIDualLineChart extends Component {

  render(){

    let { results, xLabel, yLabel, dataKey1, dataKey2, dataKey3, dataKey4 } = this.props;

    return(
      <div>
          <LineChart width={900} height={600} data={results}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name">
              <Label value={xLabel} position="insideBottom" offset={2} />
            </XAxis>
            <YAxis domain={['dataMin-10', 'dataMax+10']}>
              <Label value={yLabel} position="insideLeft" offset={0} />
            </YAxis>
            <Legend />
            <Tooltip/>
            <Line type='monotone' dataKey={dataKey1} stroke='#8884d8' dot={false} />
            <Line type='monotone' dataKey={dataKey2} stroke='#82ca9d' dot={false} />
            <Line type='monotone' dataKey={dataKey3} stroke='#e79797' dot={false} />
            <Line type='monotone' dataKey={dataKey4} stroke='#ed9f37' dot={false} />
            <Brush />
          </LineChart>
      </div>
    );
  }
}

export default ACIDualLineChart;
