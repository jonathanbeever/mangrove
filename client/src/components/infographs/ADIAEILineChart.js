import React, { Component } from 'react';
import {LineChart, Line, Label, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class ADIAEILineChart extends Component {

  formatYAxis = (tickItem) => {
    let asF = parseFloat(tickItem);
    return (asF).toFixed(2);
  }

  render(){

    let { results, xAxisLabel, yAxisLabel, dataKey1, dataKey2, vals, index } = this.props;

    return(
      <div>
        <h6>{index} Left: {parseFloat(vals[0]).toFixed(2)}</h6>
        <h6>{index} Right: {parseFloat(vals[1]).toFixed(2)}</h6>
        <LineChart width={900} height={600} data={results}
          margin={{top: 10, right: 30, left: 0, bottom: 0}}>
         <CartesianGrid strokeDasharray="3 3"/>
         <XAxis dataKey="name">
           <Label value={xAxisLabel} position="insideBottom" offset={2} />
         </XAxis>
         <YAxis label={yAxisLabel} offset={0} tickFormatter={this.formatYAxis}/>
         <Tooltip/>
         <Legend />
         <Line type="monotone" dataKey={dataKey1} stroke="#8884d8" dot={false}/>
         <Line type="monotone" dataKey={dataKey2} stroke="#82ca9d" dot={false}/>
        </LineChart>
      </div>
    );
  }
}

export default ADIAEILineChart;
