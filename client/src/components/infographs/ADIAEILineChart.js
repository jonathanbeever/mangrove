import React, { Component } from 'react';
import {LineChart, Line, Label, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend} from 'recharts';

class ADIAEILineChart extends Component {

  formatYAxis = (tickItem) => {
    let asF = parseFloat(tickItem);
    return (asF).toFixed(2);
  }

  render(){

    let { reference, results, xAxisLabel, yAxisLabel, refLabel1, refLabel2, refL, refR, dataKey1, dataKey2 } = this.props;

    const referenceLines = [<ReferenceLine y={refL} label={refLabel1} stroke="#8884d8"/>,
                            <ReferenceLine y={refR} label={refLabel2} stroke="#82ca9d"/>
                            ];

    return(
      <div>
        <LineChart width={900} height={600} data={results}
          margin={{top: 10, right: 30, left: 0, bottom: 0}}>
         <CartesianGrid strokeDasharray="3 3"/>
         <XAxis dataKey="name">
           <Label value={xAxisLabel} position="insideBottom" offset={2} />
         </XAxis>
         <YAxis label={yAxisLabel} tickFormatter={this.formatYAxis}/>
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
