import React, { Component } from 'react';
import Recharts, {BarChart, Bar, LineChart, Line, Brush, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class NDSICharts extends Component {

  render(){
    let data = this.props.results;
    let graph1 = data.graph1;
    let graph2 = data.graph2;
    let graph3 = data.graph3;

    let content;

    if(graph3.length === 0)
    {
      content = (
        <div>
          <BarChart width={900} height={600} data={graph1}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" label="Channel"/>
            <YAxis label="Value"/>
            <Tooltip />
            <Legend />
            <ReferenceLine y={0} stroke='#000' />
            <Bar dataKey="ndsi" fill="#8884d8" />
            <Bar dataKey="biophony" fill="#82ca9d" />
            <Bar dataKey="anthrophony" fill="#e79797" />
          </BarChart>
          <BarChart width={900} height={600} data={graph2}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" label="Value"/>
            <YAxis label="Variable"/>
            <Tooltip />
            <Legend />
            <ReferenceLine y={0} stroke='#000' />
            <Bar dataKey="leftChannel" fill="#8884d8" />
            <Bar dataKey="rightChannel" fill="#82ca9d" />
          </BarChart>
        </div>
      )
    }else
    {
      content = (
        <div>
          <BarChart width={900} height={600} data={graph1}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" label="Channel"/>
            <YAxis label="Value"/>
            <Tooltip />
            <Legend />
            <ReferenceLine y={0} stroke='#000' />
            <Bar dataKey="ndsi" fill="#8884d8" />
            <Bar dataKey="biophony" fill="#82ca9d" />
            <Bar dataKey="anthrophony" fill="#e79797" />
          </BarChart>
          <BarChart width={900} height={600} data={graph2}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" label="Value"/>
            <YAxis label="Variable"/>
            <Tooltip />
            <Legend />
            <ReferenceLine y={0} stroke='#000' />
            <Bar dataKey="leftChannel" fill="#8884d8" />
            <Bar dataKey="rightChannel" fill="#82ca9d" />
          </BarChart>
          <LineChart width={900} height={600} data={graph3} syncId="1">
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey='name' label='Hour of Day'/>
            <YAxis label='Value'/>
            <Legend />
            <Tooltip/>
            <Line type='natural' dataKey='ndsiL' stroke='#8884d8' dot={false} />
            <Line type='natural' dataKey='ndsiR' stroke='#82ca9d' dot={false} />
            <Brush syncId = "1"/>
          </LineChart>
          <LineChart width={900} height={600} data={graph3} syncId="2">
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey='name' label='Hour of Day'/>
            <YAxis label='Value'/>
            <Legend />
            <Tooltip/>
            <Line type='natural' dataKey='biophonyL' stroke='#8884d8' dot={false} />
            <Line type='natural' dataKey='biophonyR' stroke='#5551a2' dot={false} />
            <Line type='natural' dataKey='anthrophonyL' stroke='#257142' dot={false} />
            <Line type='natural' dataKey='anthrophonyR' stroke='#82ca9d' dot={false} />
            <Brush syncId="2"/>
          </LineChart>
        </div>
      )
    }

    return(
      <div>
        {content}
      </div>
    );
  }
}

export default NDSICharts;
