import React, {Component} from 'react';
import Recharts, {AreaChart, Brush, Legend, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

class CompareBioData extends Component {

  render(){
    let graphs = this.props.results;
    let graph1 = graphs.graph1;

    return(
      <div>
        <h5>Comparing Bioacoustic Results</h5>
        <AreaChart width={900} height={600} data={graph1} >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name" label="Date"/>
          <Legend />
          <YAxis label="Area Value" domain={[0, 'dataMax+5']}/>
          <Tooltip/>
          <Area type='monotone' dataKey='areaL' stackId="1" stroke='#8884d8' fill='#8884d8' />
          <Area type='monotone' dataKey='areaR' stackId="1" stroke='#82ca9d' fill='#82ca9d' />
          <Brush />
        </AreaChart>
      </div>
    );
  }
}

export default CompareBioData;
