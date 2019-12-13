import React, { Component } from 'react';
import {BarChart, Label, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


class NDSIValuesBarChart extends Component {

  formatYAxis = (tickItem) => {
    let asF = parseFloat(tickItem);
    return (asF).toFixed(2);
  }

  render(){

    let data = this.props.results;

    return(
      <div>
        <BarChart width={900} height={600} data={data}
          margin={{top: 10, right: 30, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name">
            <Label value="NDSI Values" position="insideBottom" offset={2} />
          </XAxis>
          <YAxis tickFormatter={this.formatYAxis}>
            <Label value="Value" position="insideLeft" offset={0} tickFormatter={this.formatYAxis} />
          </YAxis>
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke='#000' />
          <Bar dataKey="ndsi" fill="#8884d8" />
          <Bar dataKey="biophony" fill="#82ca9d" />
          <Bar dataKey="anthrophony" fill="#e79797" />
        </BarChart>
      </div>
    )
  }
}

export default NDSIValuesBarChart;
