import React, { Component } from 'react';
import Recharts, {LineChart, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend} from 'recharts';

class AEILineChart extends Component {

  render(){

    return(
      <div>
        <LineChart width={900} height={600} data={this.props.results} >
         <CartesianGrid strokeDasharray="3 3"/>
         <XAxis dataKey="name" label={this.props.xAxisLabel}/>
         <YAxis label="AEI Value"/>
         <Tooltip/>
         <Legend />
         <ReferenceLine y={this.props.refL} label="AEI Left" stroke="#433eaf"/>
         <ReferenceLine y={this.props.refR} label="AEI Right" stroke="#187139"/>
         <Line type="monotone" dataKey={this.props.dataKey1} stroke="#8884d8" dot={false}/>
         <Line type="monotone" dataKey={this.props.dataKey2} stroke="#82ca9d" dot={false}/>
        </LineChart>
      </div>
    );
  }
}

export default AEILineChart;
