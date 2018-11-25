import React, { Component } from 'react';
import Recharts, {LineChart, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend} from 'recharts';

class AEILineChart extends Component {

  render(){
    let graphs = this.props.results;
    let graph1 = graphs.graph1;
    let graph2 = graphs.graph2;
    let graph3 = graphs.graph3;
    let graph4 = graphs.graph4;
    let aeiLeft = graph3[0].data;
    let aeiRight = graph3[1].data;

    let content;

    if(graph2.length === 0)
    {
      content = (
        <LineChart width={900} height={600} data={graph1} >
         <CartesianGrid strokeDasharray="3 3"/>
         <XAxis dataKey="name" label="Hz Range"/>
         <YAxis label="AEI Value"/>
         <Tooltip/>
         <Legend />
         <ReferenceLine y={aeiLeft} label="AEI Left" stroke="#433eaf"/>
         <ReferenceLine y={aeiRight} label="AEI Right" stroke="#187139"/>
         <Line type="monotone" dataKey="leftBandVal" stroke="#8884d8" dot={false}/>
         <Line type="monotone" dataKey="rightBandVal" stroke="#82ca9d" dot={false}/>
        </LineChart>
      )
    }else
    {
      content = (
        <div>
          <LineChart width={900} height={600} data={graph1} >
           <CartesianGrid strokeDasharray="3 3"/>
           <XAxis dataKey="name" label="Hz Range"/>
           <YAxis label="AEI Value"/>
           <Tooltip/>
           <Legend />
           <ReferenceLine y={aeiLeft} label="AEI Left" stroke="#433eaf"/>
           <ReferenceLine y={aeiRight} label="AEI Right" stroke="#187139"/>
           <Line type="monotone" dataKey="leftBandVal" stroke="#8884d8" dot={false}/>
           <Line type="monotone" dataKey="rightBandVal" stroke="#82ca9d" dot={false}/>
          </LineChart>
          <br />
          <LineChart width={900} height={600} data={graph4} >
           <CartesianGrid strokeDasharray="3 3"/>
           <XAxis dataKey="name" label="File Name"/>
           <YAxis label="AEI Value"/>
           <Tooltip/>
           <Legend />
           <ReferenceLine y={aeiLeft} label="AEI Left" stroke="#433eaf"/>
           <ReferenceLine y={aeiRight} label="AEI Right" stroke="#187139"/>
           <Line type="monotone" dataKey="leftAEIVal" stroke="#8884d8" dot={false}/>
           <Line type="monotone" dataKey="rightAEIVal" stroke="#82ca9d" dot={false}/>
          </LineChart>
          <br />
          <LineChart width={900} height={600} data={graph2} >
           <CartesianGrid strokeDasharray="3 3"/>
           <XAxis dataKey="name" label="Hour of Day"/>
           <YAxis label="AEI Value"/>
           <Tooltip/>
           <Legend />
           <ReferenceLine y={aeiLeft} label="AEI Left" stroke="#433eaf"/>
           <ReferenceLine y={aeiRight} label="AEI Right" stroke="#187139"/>
           <Line type="monotone" dataKey="leftAEIVal" stroke="#8884d8" dot={false}/>
           <Line type="monotone" dataKey="rightAEIVal" stroke="#82ca9d" dot={false}/>
          </LineChart>
        </div>
      )
    }

    return(
      <div>
        <h4>AEI Values</h4>
        <h5>{graph3[0].name}: {graph3[0].data}</h5>
        <h5>{graph3[1].name}: {graph3[1].data}</h5>
        <br />
        {content}
      </div>
    );
  }
}

export default AEILineChart;
