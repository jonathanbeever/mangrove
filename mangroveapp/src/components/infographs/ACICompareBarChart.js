import React, { Component } from 'react';
import {BarChart, Bar, Label, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


class ACIBarChart extends Component {

  formatYAxis = (tickItem) => {
    let asF = parseFloat(tickItem);
    return (asF).toFixed(2);
  }

  render(){

    let data = this.props.results;

    return(
      <div>
        <BarChart width={900} height={600} data={data}
          margin={{top: 10, right: 30, left: 30, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" height={45}>
            <Label value="File Name" position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="ACI" position="insideLeft" offset={-30} tickFormatter={this.formatYAxis} />
          </YAxis>
          <Tooltip />
          <Legend />
          <Bar dataKey="aciTotAllByMinL" fill="#8884d8" />
          <Bar dataKey="aciTotAllByMinR" fill="#82ca9d" />
          <Bar dataKey="aciTotAllByMinLC" fill="#e79797" />
          <Bar dataKey="aciTotAllByMinRC" fill="#ed9f37" />
        </BarChart>
      </div>
    )
  }
}

export default ACIBarChart;
