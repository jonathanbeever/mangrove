import React, { Component } from 'react';
import Recharts, {LineChart, Line, Legend, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

// ret = {
//   graph1: [
//           { name: 'Left Channel',
//             ndsi: results.ndsiL,
//             biophony: results.biophonyL,
//             anthrophony: results.anthrophonyL
//           },
//           { name: 'Right Channel',
//             ndsi: results.ndsiR,
//             biophony: results.biophonyR,
//             anthrophony: results.anthrophonyR
//           }
//         ],
//   graph2: [
//           { name: 'NDSI',
//             leftChannel: results.ndsiL,
//             rightChannel: results.ndsiR
//           },
//           { name: 'Biophony',
//             leftChannel: results.biophonyL,
//             rightChannel: results.biophonyR
//           },
//           {
//             name: 'Anthrophony',
//             leftChannel: results.anthrophonyL,
//             rightChannel: results.anthrophonyR
//           }
//         ]
//   // graph3: []
//   ]
// }

class ACILineChart extends Component {

  render(){
    let data = this.props.results;

    let xLabel = this.props.xAxisLabel;
    let yLabel = this.props.yAxisLabel;

    let firstDataKey = this.props.dataKey1;
    let secondDataKey = this.props.dataKey2;

    return(
      <div>
          <LineChart width={900} height={600} data={data} syncId="anyId">
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name" label={xLabel}/>
            <YAxis label={yLabel}/>
            <Legend />
            <Tooltip/>
            <Line type='natural' dataKey={firstDataKey} stroke='#8884d8' dot={false} />
            <Line type='natural' dataKey={secondDataKey} stroke='#82ca9d' dot={false} />
            <Brush />
          </LineChart>
      </div>
    );
  }
}



export default ACILineChart;
