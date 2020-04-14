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

    const jobIds = [];

    const annotationType = `${this.props.jobs[0].spec.type}Annotation`;

    this.props.jobs.forEach(job => {
      jobIds.push(job.jobId);
    })

    this.props.jobs.forEach(job => {
      const url = 'http://127.0.0.1:34251/annotations/' + job.jobId;

      requests.push(axios.get(url, 
        { params: {
          author: window.localStorage.getItem('email'),
          jobIds,
          annotationType
        } 
      }).then(res => {
        res.data.annotations.forEach(annotation => {
          let shouldAdd = true;

          // Check final list of annotations to see if the returned annotation has already been found
          annotations.forEach(element => {
            if (annotation.annotationId === element.annotationId) shouldAdd = false;
          });

          if (shouldAdd || annotations.length === 0) annotations.push(annotation);
        });
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
          annotations={this.state.annotations}
        />
      </div>
    )
  }

}

export default SpecAnalysisPanel;
