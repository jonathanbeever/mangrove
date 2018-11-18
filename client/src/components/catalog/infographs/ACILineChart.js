import React, { Component } from 'react';
import Recharts, {LineChart, Line, Legend, AreaChart, Area, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class ACILineChart extends Component {

  render(){
    let graphs = this.props.results;
    let graph1 = graphs.graph1;
    let graph2 = graphs.graph2;

    return(
      <div>
        <h3>ACI Totals:</h3>
        <h5>{graph2[0].name} - {graph2[0].data}</h5>
        <h5>{graph2[1].name} - {graph2[1].data}</h5>
        <h5>{graph2[2].name} - {graph2[2].data}</h5>
        <h5>{graph2[3].name} - {graph2[3].data}</h5>
        <br />
          <LineChart width={900} height={600} data={graph1} syncId="anyId">
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name" label="Time (s)"/>
            <YAxis label="ACI Value"/>
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



export default ACILineChart;
