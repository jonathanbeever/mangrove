import React, { Component } from 'react';
import GraphsTable from './graphsTable';

class SpecAnalysisPanel extends Component {

  render(){
    return(
      <div>
        <GraphsTable
          index={this.props.index}
          graphs={this.props.graphs}
          callback={this.props.callback}
          audioCallback={this.props.audioCallback}
        />
      </div>
    )
  }

}

export default SpecAnalysisPanel;
