import React, { Component } from 'react';
import Recharts, {BarChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


class NDSIValuesBarChart extends Component {

  render(){

    let data = this.props.results;
    console.log(data);

    return(
      <div>
        <BarChart width={900} height={600} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" label="NDSI Values"/>
          <YAxis label="Value"/>
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
