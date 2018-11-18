import React, {Component} from 'react';
import Recharts, {AreaChart, Brush, Legend, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';


class BAAreaChart extends Component {

  render(){
    let graphs = this.props.results;
    let graph1 = graphs.graph1;
    let graph2 = graphs.graph2;

    return(
      <div>
        <h3>Bioacoustic Area Values:</h3>
        <h5>{graph2[0].name} - {graph2[0].data}</h5>
        <h5>{graph2[1].name} - {graph2[1].data}</h5>
        <br />
        <AreaChart width={900} height={600} data={graph1} >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name" label="Hz Range"/>
          <Legend />
          <YAxis label="Spectrum Value" domain={['dataMin', 'dataMax']} />
          <Tooltip/>
          <Area type='monotone' dataKey='leftSpectrum' stackId="1" stroke='#8884d8' fill='#8884d8' />
          <Brush />
        </AreaChart>
        <AreaChart width={900} height={600} data={graph1} >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name" label="Hz Range"/>
          <Legend />
          <YAxis label="Spectrum Value" domain={['dataMin', 'dataMax']} />
          <Tooltip/>
          <Area type='monotone' dataKey='rightSpectrum' stackId="1" stroke='#82ca9d' fill='#82ca9d' />
          <Brush />
        </AreaChart>
      </div>
    );
  }
}

export default BAAreaChart;
