import React, { Component } from 'react';
import Recharts, {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class ACILineChart extends Component {

  render(){
    let data = this.props.results;
    let graph1 = data.graph1;
    let graph2 = data.graph2;

    return(
      <div>
        <h3>ACI Totals:</h3>
        <h5>{graph2[0].name} - {graph2[0].data}</h5>
        <h5>{graph2[1].name} - {graph2[1].data}</h5>
        <LineChart width={900} height={600} data={graph1}>
         <XAxis dataKey="name"/>
         <YAxis/>
         <CartesianGrid strokeDasharray="3 3"/>
         <Tooltip/>
         <Legend />
         <Line type="monotone" dataKey="data" stroke="#8884d8" activeDot={{r: 8}} />
         <Line type="monotone" dataKey="data" stroke="#82ca9d" />
        </LineChart>
      </div>
    );
  }
}



export default ACILineChart;
