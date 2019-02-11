import React, { Component } from 'react';
import {LineChart, Line, Label, Legend, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class NDSIDualLineChart extends Component {

  render(){

    let { results } = this.props;

    return(
      <div>

          <LineChart width={900} height={600} data={results}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name">
              <Label value="NDSI Values" position="insideBottom" offset={2} />
            </XAxis>
            <YAxis domain={['dataMin', 'dataMax']}>
              <Label value="NDSI Value" position="insideLeft" offset={0} />
            </YAxis>
            <Legend />
            <Tooltip/>
            <Line type='monotone' dataKey="ndsi" stroke="#8884d8" dot={false} />
            <Line type='monotone' dataKey="ndsiC" stroke="#1910d4" dot={false} />
            <Line type='monotone' dataKey="biophony" stroke="#82ca9d" dot={false} />
            <Line type='monotone' dataKey="biophonyC" stroke="#108f3f" dot={false} />
            <Line type='monotone' dataKey="anthrophony" stroke="#e79797" dot={false} />
            <Line type='monotone' dataKey="anthrophonyC" stroke="#e73535" dot={false} />
            <Brush />
          </LineChart>
      </div>
    );
  }
}

export default NDSIDualLineChart;
