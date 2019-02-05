import React, { Component } from 'react';
import {LineChart, Line,Label,  XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend} from 'recharts';

class ADILineChart extends Component {

  render(){

    let { results, xAxisLabel, refL, refR, dataKey1, dataKey2 } = this.props;

    return(
      <div>
        <LineChart width={900} height={600} data={results} >
         <CartesianGrid strokeDasharray="3 3"/>
         <XAxis dataKey="name">
           <Label value={xAxisLabel} position="insideBottom" offset={2} />
         </XAxis>
         <YAxis label="ADI Value"/>
         <Tooltip/>
         <Legend />
         <ReferenceLine y={refL} label="ADI Left" stroke="#433eaf"/>
         <ReferenceLine y={refR} label="ADI Right" stroke="#187139"/>
         <Line type="monotone" dataKey={dataKey1} stroke="#8884d8" dot={false}/>
         <Line type="monotone" dataKey={dataKey2} stroke="#82ca9d" dot={false}/>
        </LineChart>
      </div>
    );
  }
}

export default ADILineChart;
