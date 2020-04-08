import React, { Component } from 'react';
import GraphsTable from './graphsTable';
import axios from 'axios';

class SpecAnalysisPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      annotations: [],
    }

    this.getAnnotations();
  }

  getAnnotations = () => {
    const requests = [];
    const annotations = [];

    this.props.jobs.forEach(job => {
      const url = 'http://127.0.0.1:34251/annotations/' + job.jobId;

      requests.push(axios.get(url).then(res => {
        res.data.annotations.forEach(annotation => annotations.push(annotation));
      }));
    });

    Promise.all(requests).then(responses => {
      this.setState({ annotations });
    });
  }

  render(){
    return(
      <div>
        <GraphsTable
          index={this.props.index}
          graphs={this.props.graphs}
          callback={this.props.callback}
          audioCallback={this.props.audioCallback}
          initializeAnnotationViewData={this.props.initializeAnnotationViewData}
          jobs={this.props.jobs}
          annotations={this.state.annotations}
        />
      </div>
    )
  }

}

export default SpecAnalysisPanel;
