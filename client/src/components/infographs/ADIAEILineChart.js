import React, { Component } from 'react';
import {LineChart, Line, Label, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend} from 'recharts';

class ADIAEILineChart extends Component {

  render(){

    let { reference, results, xAxisLabel, yAxisLabel, refLabel1, refLabel2, refL, refR, dataKey1, dataKey2 } = this.props;

    const referenceLines = [<ReferenceLine y={refL} label={refLabel1} stroke="#8884d8"/>,
                            <ReferenceLine y={refR} label={refLabel2} stroke="#82ca9d"/>
                            ];

    return(
      <div>
        <LineChart width={900} height={600} data={results} >
         <CartesianGrid strokeDasharray="3 3"/>
         <XAxis dataKey="name">
           <Label value={xAxisLabel} position="insideBottom" offset={2} />
         </XAxis>
         <YAxis label={yAxisLabel}/>
         <Tooltip/>
         <Legend />
         { reference ?
           referenceLines
           :
           ''
         }
         <Line type="monotone" dataKey={dataKey1} stroke="#8884d8" dot={false}/>
         <Line type="monotone" dataKey={dataKey2} stroke="#82ca9d" dot={false}/>
        </LineChart>
      </div>
    );
  }
}

export default ADIAEILineChart;
