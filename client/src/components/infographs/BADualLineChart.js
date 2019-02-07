import React, { Component } from 'react';
import {LineChart, Line, Label, Legend, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class BADualLineChart extends Component {

  render(){

    let { results, xAxisLabel, yAxisLabel } = this.props;

    return(
      <div>
          <LineChart width={900} height={600} data={results}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name">
              <Label value={xAxisLabel} position="insideBottom" offset={2} />
            </XAxis>
            <YAxis>
              <Label value={yAxisLabel} position="insideLeft" offset={0} />
            </YAxis>
            <Legend />
            <Tooltip/>
            <Line type='monotone' dataKey='areaL' stroke='#8884d8' dot={false} />
            <Line type='monotone' dataKey='areaR' stroke='#82ca9d' dot={false} />
            <Line type='monotone' dataKey='areaLC' stroke='#1910d4' dot={false} />
            <Line type='monotone' dataKey='areaRC' stroke='#108f3f' dot={false} />
            <Brush />
          </LineChart>
      </div>
    );
  }
}

export default BADualLineChart;
