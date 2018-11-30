import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';

class AnalysisView extends Component {
  constructor() {
    super();

    this.state = {
    };
  }

  componentWillReceiveProps(nextProps) {
    this.formatJob(nextProps.chosenResult)
    if(nextProps.resultToCompare)
      this.formatCompare(nextProps.resultToCompare)
    else
      this.setState({ formattedJobToCompare: null })
  }
   
  componentDidMount = () => {
    this.formatJob(this.props.chosenResult)
  }

  formatJob = (props) => {
    var formattedJob = (
      <div>
        <h5>
          {props.siteName}
        </h5>
        <p>{props.type.toUpperCase()}&nbsp;&nbsp;&nbsp;&nbsp;{props.input}&nbsp;&nbsp;&nbsp;&nbsp;{props.status}</p>
        <p>{props.spec.alias}</p>
      </div>
    )
    this.setState({ formattedJob: formattedJob })
  } 

  formatCompare = (props) => {
    var formattedJobToCompare = (
      <div>
        <h5>
          {props.siteName}
        </h5>
        <p>{props.type.toUpperCase()}&nbsp;&nbsp;&nbsp;&nbsp;{props.input}&nbsp;&nbsp;&nbsp;&nbsp;{props.status}</p>
        <p>{props.spec.alias}</p>
      </div>
    )
    this.setState({ formattedJobToCompare: formattedJobToCompare })
  }

  render() {
    return (
      <div>
        {this.state.formattedJob ? 
          <div>
            {this.state.formattedJobToCompare ? 
              <div>
                {this.state.formattedJob}
                {this.state.formattedJobToCompare}
              </div>
              :
              <div>
                {this.state.formattedJob}
              </div>
            }
          </div>
        : 
          ''
        }
      </div>
    );
  }
}

export default AnalysisView;