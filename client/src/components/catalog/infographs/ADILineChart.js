import React, { Component } from 'react';
import Recharts, {LineChart, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend} from 'recharts';

class ADILineChart extends Component {

  render(){
    let graphs = this.props.results;
    let graph1 = graphs.graph1;
    let graph2 = graphs.graph2;
    let adiLeft = graph2[0].data;
    let adiRight = graph2[1].data;

    return(
      <div>
        <h3>ADI Values:</h3>
        <h5>{graph2[0].name} - {graph2[0].data}</h5>
        <h5>{graph2[1].name} - {graph2[1].data}</h5>
        <br />
        <LineChart width={900} height={600} data={graph1} >
         <CartesianGrid strokeDasharray="3 3"/>
         <XAxis dataKey="name"/>
         <YAxis/>
         <Tooltip/>
         <Legend />
         <ReferenceLine y={adiLeft} label="ADI Left" stroke="#433eaf"/>
         <ReferenceLine y={adiRight} label="ADI Right" stroke="#187139"/>
         <Line type="monotone" dataKey="leftBandVal" stroke="#8884d8" />
         <Line type="monotone" dataKey="rightBandVal" stroke="#82ca9d" />
        </LineChart>
      </div>
    );
  }
}




export default ADILineChart;
