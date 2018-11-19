import React, {Component} from 'react';
import Recharts, {LineChart, Line, Legend, AreaChart, Area, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import ACILineChart from './infographs/ACILineChart';

class CompareACIData extends Component {

  render(){
    let graphs = this.props.results;
    let graph1 = graphs.graph1;
    let graph2 = graphs.graph2;

    return(
      <div>
        <h5>Comparing ACI Over Time</h5>
        <ACILineChart results = {graph1} xAxisLabel = {"Date"} yAxisLabel = {"ACI Value By Minute"} />
        <h5>Comparing ACI By Site</h5>
        <ACILineChart results = {graph2} xAxisLabel = {"Site"} yAxisLabel = {"ACI Value By Minute"} />
      </div>
    );
  }
}

export default CompareACIData;
