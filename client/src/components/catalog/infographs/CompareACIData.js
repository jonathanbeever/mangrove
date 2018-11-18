import React, {Component} from 'react';
import Recharts, {LineChart, Line, Legend, AreaChart, Area, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class CompareACIData extends Component {

  render(){
    let graphs = this.props.results;
    let graph1 = graphs.graph1;

    return(
      <div>
        <h5>Comparing ACI Results</h5>
        <LineChart width={900} height={600} data={graph1} syncId="anyId">
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name" label="Date"/>
          <YAxis label="ACI Value By Minute"/>
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

export default CompareACIData;
