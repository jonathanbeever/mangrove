import React, { Component } from 'react';
import BarChart from './infographs/BarChart';


class AnalysisView extends Component {
  render() {
    const chosenResult = this.props.chosenResult;

    return (
      <div>
        <h5>{chosenResult}</h5>
        <BarChart data={[5,10,1,3]} size={[500,500]} />
      </div>
    );
  }
}

export default AnalysisView;
