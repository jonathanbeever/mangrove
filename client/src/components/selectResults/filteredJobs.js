import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

class FilteredJobs extends Component {
  constructor() {
    super();

    this.state = {
    };
  }

  componentWillReceiveProps(nextProps) {
    var formattedJobs = nextProps.results.map((job, i) => {
      return (
        // change key later
        <div key={i}>
          <h5>
            {job.siteName}
            <Button color="primary">
              View Results
            </Button>
          </h5>
          <p>{job.type.toUpperCase()}&nbsp;&nbsp;&nbsp;&nbsp;{job.input}&nbsp;&nbsp;&nbsp;&nbsp;{job.status}</p>
          <p>{job.spec.alias}</p>
          <br/>
        </div>
      )
    });
    this.setState({ htmlJobs: formattedJobs })
  }
   
  componentDidMount = () => {
    // only called b4 filtering? show all?
    var formattedJobs = this.props.results.map((job, i) => {
      return (
        <div key={i}>
          <h5>
            {job.siteName}
            <Button color="primary">
              View Results
            </Button>
          </h5>
          <p>{job.type.toUpperCase()}&nbsp;&nbsp;&nbsp;&nbsp;{job.input}&nbsp;&nbsp;&nbsp;&nbsp;{job.status}</p>
          <p>{job.spec.alias}</p>
          <br/>
        </div>
      )
    });

    this.setState({ htmlJobs: formattedJobs })
    this.setState({ resultsLength: this.props.results.length })
  }

  render() {
    return (
      <Panel>
        <Panel.Heading>
          List of Filtered Jobs
        </Panel.Heading>
        <Panel.Body>
          <Card>
            <CardContent>
              { this.state.htmlJobs ? this.state.htmlJobs : '' }
            </CardContent>
          </Card>
        </Panel.Body>
      </Panel>
    );
  }
}

export default FilteredJobs;