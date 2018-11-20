import React, { Component } from 'react';
import Recharts, {LineChart, Line, Legend, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class OutlierLineChart extends Component {

  render(){
    let data = this.props.results;

    let index = this.props.index;

    let xLabel = this.props.xAxisLabel;
    let yLabel = this.props.yAxisLabel;

    let firstDataKey = this.props.dataKey1;
    let secondDataKey = this.props.dataKey2;

    return(
      <div>
        <h5>Identifying Outliers for {index}</h5>
        <LineChart width={900} height={600} data={data} syncId="anyId">
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey='name' label={xLabel}/>
          <YAxis label={yLabel}/>
          <Legend />
          <Tooltip/>
          <Line type='natural' dataKey='leftData' stroke='#8884d8' dot={false} />
          <Line type='natural' dataKey='rightData' stroke='#82ca9d' dot={false} />
          <Brush />
        </LineChart>
      </div>
    );
  }
}

export default OutlierLineChart;
