import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import axios from 'axios';

const styles = {
  finished: {
    backgroundColor: '#82ca9d',
    fontSize:14+'px',
  },
  failed: {
    backgroundColor: '#e79797',
    fontSize:14+'px',
  },
  processing: {
    backgroundColor: 'rgb(244, 169, 82)',
    fontSize:14+'px',
  },
  cancelled: {
    backgroundColor: 'yellow',
    fontSize:14+'px',
  },
  queued: {
    backgroundColor: '#8884d8',
    fontSize:14+'px',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  }
}

class JobQueue extends Component {
  state = {
    jobs: [],
    inputs: [],
    specs: [],
    data: [],
    filtered: false,
    page: 0,
    rowsPerPage: 5,
  };

  componentDidMount = () => {
    // this.getJobs();
    // this.getInputs();
    // this.getSpecs();

    this.refreshJobs();
  };

  statusCell = (status) => {
    switch(status){
      case "finished":
        return(
          <TableCell className={this.props.classes.finished} component="th" scope="row" padding="checkbox">
            <p>
              Finished
            </p>
          </TableCell>
        );
      case "cancelled":
        return(
          <TableCell className={this.props.classes.cancelled} component="th" scope="row" padding="checkbox">
            <p>
              Cancelled
            </p>
          </TableCell>
        );
      case "processing":
        return(
          <TableCell className={this.props.classes.processing} component="th" scope="row" padding="checkbox">
            <p>
              Processing
            </p>
          </TableCell>
        );
      case "failed":
        return(
          <TableCell className={this.props.classes.failed} component="th" scope="row" padding="checkbox">
            <p>
              Failed
            </p>
          </TableCell>
        );
    }
  };

  updateTable = () => {
    this.setState(state => {
      return {
        data: state.data.filter(x => x.status !== "finished")
      }
    });
  };

  refreshJobs = () => {
    const requests = [
      axios.get('http://localhost:3000/jobs'),
      axios.get('http://localhost:3000/inputs'),
      axios.get('http://localhost:3000/specs')
    ];

    Promise.all(requests)
      .then(responses => {
        const jobs = responses[0].data.jobs;
        const inputs = responses[1].data.inputs;
        const specs = responses[2].data.specs;

        // console.log(jobs);
        // console.log(inputs);
        // console.log(specs);

        const data = jobs.map(job => {
          job.input = inputs.find(x => x.inputId === job.input);
          job.spec = specs.find(x => x.specId === job.spec);
          return job;
        });

        // console.log(data);

        this.setState({ jobs });
        this.setState({ inputs });
        this.setState({ specs });
        this.setState({ data });
      });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render(){

    const { rowsPerPage, page, jobs, filtered, data } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, jobs.length - page * rowsPerPage);

    return(
      <div className="container">
        <div className="row">
          <div className="col-6">
            <Button
              variant="contained"
              color="primary"
              style={{ marginBottom:10+'px'}}
              onClick={this.updateTable}
              >
              <h6>Clear Finished</h6>
            </Button>
          </div>
          <div className="col-6 text-right">
            <Button
              variant="contained"
              color="primary"
              style={{ marginBottom:10+'px'}}
              onClick={this.refreshJobs}
              >
              <h6>Refresh Jobs</h6>
            </Button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Paper>
              <Table aria-labelledby="tableTitle">
                <TableHead>
                  <TableRow>
                    <TableCell><h4>Job Description</h4></TableCell>
                    <TableCell><h4>File Name</h4></TableCell>
                    <TableCell><h4>Spec Used</h4></TableCell>
                    <TableCell><h4>Time Started</h4></TableCell>
                    <TableCell><h4>Author</h4></TableCell>
                    <TableCell><h4>Status</h4></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(job =>
                  {
                    let date = new Date(job.creationTimeMs);
                    date = date.getHours() + ":" + date.getMinutes() + " - " + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
                    let jobDesc = job.input.site + " - " + job.input.series;
                    let fileName = job.input.path.substring(job.input.path.lastIndexOf('\\')+1);
                    let specDesc = job.spec.type;
                    return(
                      <TableRow
                        key={job.jobId}
                      >
                        <TableCell style={{ fontSize:14+'px' }} component="th" scope="row" padding="checkbox">
                            {jobDesc}
                        </TableCell>
                        <TableCell style={{ fontSize:14+'px' }} component="th" scope="row" padding="checkbox">
                            {fileName}
                        </TableCell>
                        <TableCell style={{ fontSize:14+'px' }} component="th" scope="row" padding="checkbox">
                            {specDesc}
                        </TableCell>
                        <TableCell style={{ fontSize:14+'px' }} component="th" scope="row" padding="checkbox">
                            {date}
                        </TableCell>
                        <TableCell style={{ fontSize:14+'px' }} component="th" scope="row" padding="checkbox">
                            {job.author}
                        </TableCell>
                        {this.statusCell(job.status)}
                      </TableRow>
                    )
                  })
                }
                </TableBody>
              </Table>
              <TablePagination
                labelRowsPerPage={<p style={{fontSize:13+'px'}}>Rows per page:</p>}
                labelDisplayedRows={({ from, to , count}) => <p style={{fontSize:10+'px'}}>Displaying items {from}-{to} of total {count} items</p>}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={jobs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                  'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page',
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(JobQueue);
