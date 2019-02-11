import React, { Component } from 'react';
import {BarChart, Bar, Label, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';


class NDSIChannelCompareBarChart extends Component {

  render(){

    let data = this.props.results;

    // console.log(this.props);

    return(
      <div>
        <BarChart width={900} height={600} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name">
            <Label value="NDSI Values" position="insideBottom" offset={2} />
          </XAxis>
          <YAxis>
            <Label value="Value" position="insideLeft" offset={0} />
          </YAxis>
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke='#000' />
          <Bar dataKey="ndsi" fill="#8884d8" />
          <Bar dataKey="ndsiC" fill="#1910d4" />
          <Bar dataKey="biophony" fill="#82ca9d" />
          <Bar dataKey="biophonyC" fill="#108f3f" />
          <Bar dataKey="anthrophony" fill="#e79797" />
          <Bar dataKey="anthrophonyC" fill="#e73535" />
        </BarChart>
      </div>
    )
  }
}

export default NDSIChannelCompareBarChart;
