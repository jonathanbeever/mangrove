import React, { Component } from 'react';
import Recharts, {ComposedChart, Bar, Brush, Line, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class NDSICompareChart extends Component {

  render(){
    let data = this.props.results;

    let xLabel = this.props.xAxisLabel;
    let yLabel = this.props.yAxisLabel;

    let firstDataKey = this.props.dataKey1;
    let secondDataKey = this.props.dataKey2;

    return(
      <div>
        <ComposedChart width={900} height={600} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" label={xLabel}/>
          <YAxis label={yLabel}/>
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke='#000' />
          <Brush dataKey='name' height={30} />
          <Bar dataKey={firstDataKey} fill="#8884d8" />
          <Bar dataKey={secondDataKey} fill="#82ca9d" />
          <Line type='monotone' dataKey={firstDataKey} stroke='#8884d8' dot={false}/>
          <Line type='monotone' dataKey={secondDataKey} stroke='#82ca9d' dot={false}/>
        </ComposedChart>
      </div>
    );
  }
}

export default NDSICompareChart;
