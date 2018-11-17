import React, { Component } from 'react';
import Recharts, {BarChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class NDSIBarChart extends Component {

  render(){
    let data = this.props.results;
    let graph1 = data.graph1;
    let graph2 = data.graph2;
    return(
      <div>
        <BarChart width={900} height={600} data={graph1}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" label="Channel"/>
          <YAxis label="Value"/>
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke='#000' />
          <Bar dataKey="ndsi" fill="#8884d8" />
          <Bar dataKey="biophony" fill="#82ca9d" />
          <Bar dataKey="anthrophony" fill="#e79797" />
        </BarChart>
        <BarChart width={900} height={600} data={graph2}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" label="Value"/>
          <YAxis label="Variable"/>
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke='#000' />
          <Bar dataKey="leftChannel" fill="#8884d8" />
          <Bar dataKey="rightChannel" fill="#82ca9d" />
        </BarChart>
      </div>
    );
  }
}

export default NDSIBarChart;
