import React, { Component } from 'react';
import {LineChart, Line, Legend, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class ACIDualLineChart extends Component {

  render(){

    let { results, xLabel, yLabel, dataKey1, dataKey2, dataKey3, dataKey4 } = this.props;

    return(
      <div>
          <LineChart width={900} height={600} data={results}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name" label={xLabel}/>
            <YAxis label={yLabel} domain={['dataMin-10', 'dataMax+10']} />
            <Legend />
            <Tooltip/>
            <Line type='natural' dataKey={dataKey1} stroke='#8884d8' dot={false} />
            <Line type='natural' dataKey={dataKey2} stroke='#82ca9d' dot={false} />
            <Line type='natural' dataKey={dataKey3} stroke='#e46f6f' dot={false} />
            <Line type='natural' dataKey={dataKey4} stroke='#ed9f37' dot={false} />
            <Brush />
          </LineChart>
      </div>
    );
  }
}

export default ACIDualLineChart;
