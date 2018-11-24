import React, {Component} from 'react';
import ADIAEICharts from './ADIAEICharts';

class CompareADIData extends Component {

  render(){
    let graphs = this.props.results;
    let graph1 = graphs.graph1;
    let graph2 = graphs.graph2;

    return(
      <div>
        <h5>Average ADI Value By Hour of Day</h5>
        {/*<ADIAEICharts results = {graph1} xAxisLabel = {"Hour"} yAxisLabel = {"ADI Value By Minute"} />*/}
      </div>
    );
  }
}

export default CompareADIData;
