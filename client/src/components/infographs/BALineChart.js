import React, { Component } from 'react';
import Recharts, {LineChart, Line, Legend, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class BALineChart extends Component {

  render(){
    let data = this.props.results;

    let xLabel = this.props.xAxisLabel;
    let yLabel = this.props.yAxisLabel;

    return(
      <div>
          <LineChart width={900} height={600} data={data} syncId="anyId">
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey='name' label={xLabel}/>
            <YAxis label={yLabel}/>
            <Legend />
            <Tooltip/>
            <Line type='natural' dataKey='areaL' stroke='#8884d8' dot={false} />
            <Line type='natural' dataKey='areaR' stroke='#82ca9d' dot={false} />
            <Brush />
          </LineChart>
      </div>
    );
  }
}



export default BALineChart;
