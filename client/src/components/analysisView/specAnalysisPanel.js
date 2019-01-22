import React, { Component } from 'react';
import GraphsTable from './graphsTable';

class SpecAnalysisPanel extends Component {

  render(){

    return(
      <div>
        <GraphsTable
          index={this.props.index}
          graphs={this.props.graphs}
        />
      </div>
    )
  }

}

export default SpecAnalysisPanel;
