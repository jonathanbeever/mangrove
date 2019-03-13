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
    jobs: null,
    inputs: null,
    page: 0,
    rowsPerPage: 5,
  };

  componentDidMount = () => {
    this.refreshJobs();
    this.interval = setInterval(() => this.refreshJobs(), 5000);
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
  }

  // creates a cell given a status code
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
      case "queued":
        return(
          <TableCell className={this.props.classes.queued} component="th" scope="row" padding="checkbox">
            <p>
              Queued
            </p>
          </TableCell>
        );
      default:
        return(
          <TableCell className={this.props.classes.failed} component="th" scope="row" padding="checkbox">
            <p>
              Unknown Status
            </p>
          </TableCell>
        );
    }
  };

  updateTable = () => {

    let jobRequests = [];
    let queueJobIds = JSON.parse(localStorage.getItem("jobs"));
    if(!queueJobIds) queueJobIds = [];

    // create requests for getting each job
    queueJobIds.forEach(job => {
      jobRequests.push(axios.get('http://localhost:3000/jobs/'+job));
    });

    Promise.all(jobRequests)
      .then(responses => {

        // filter out jobs that are finished
        let filteredQueuedJobs = responses.filter(resp => { return resp.data.status !== "finished" }).map(resp => resp.data._id)
        localStorage.setItem("jobs", JSON.stringify(filteredQueuedJobs));
        this.refreshJobs();

      });
  };

  refreshJobs = () => {

    // load in stored queue job id's
    let jobRequests = [];
    let queueJobIds = JSON.parse(localStorage.getItem("jobs"));
    if(!queueJobIds) queueJobIds = [];

    // create requests for getting each job
    queueJobIds.forEach(job => {
      jobRequests.push(axios.get('http://localhost:3000/jobs/'+job));
    });

    // execute requests for jobs
    Promise.all(jobRequests)
      .then(responses => {

        // create requests for getting each input for each job
        let jobData = [];
        let inputRequests = [];
        let specRequests = [];
        responses.forEach(response => {
          let inputId = response.data.input;
          let specId = response.data.spec
          inputRequests.push(axios.get('http://localhost:3000/inputs/'+inputId));
          specRequests.push(axios.get('http://localhost:3000/specs/'+specId))
          jobData.push(response.data);
        });

        // execute requests for inputs
        Promise.all(inputRequests)
          .then(responses => {
            let inputData = [];
            responses.forEach(response => {
              inputData.push(response.data);
            });

            this.setState({ jobs: jobData });
            this.setState({ inputs: inputData });
          });

        Promise.all(specRequests)
          .then(responses => {
            let specData = [];
            responses.forEach(response => {
              specData.push(response.data)
            });

            this.setState({ specs: specData })
          })
      });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render(){

    const { rowsPerPage, page } = this.state;

    let data = [];
    let jobs = this.state.jobs;
    let inputs = this.state.inputs;
    let specs = this.state.specs;

    // if we've gotten the information from the server
    if(jobs && inputs && specs)
    {
      // fill in jobs with their input information
      for(let i = 0; i < jobs.length; i++)
      {
        jobs[i]["input"] = inputs[i];
        jobs[i]["spec"] = specs[i]
      }
      data = jobs;
    }

    return(
      <div className="container">
        <div className="row">
          <div className="col-6">
            <Button
              style={{ marginBottom:10+'px', marginTop:10+'px'}}
              onClick={this.updateTable}
              >
              <h6>Clear Finished</h6>
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
                    <TableCell><h4>Index Used</h4></TableCell>
                    <TableCell><h4>Time Started</h4></TableCell>
                    <TableCell><h4>Author</h4></TableCell>
                    <TableCell><h4>Status</h4></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {
                  data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                   .filter(el => { return el != null; }).map(job =>
                   {
                     let date = new Date(job.creationTimeMs);
                     date = ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2) + '/' + date.getFullYear() + ' ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
                     let jobDesc = job.input.site + " - " + job.input.series;
                     let specDesc = job.spec.type.toUpperCase();
                     return(
                       <TableRow
                         key={job.jobId}
                       >
                         <TableCell style={{ fontSize:14+'px' }} component="th" scope="row" padding="checkbox">
                             {jobDesc}
                         </TableCell>
                         <TableCell style={{ fontSize:14+'px' }} component="th" scope="row" padding="checkbox">
                             {job.input.name}
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
                labelDisplayedRows={({ from, to, count}) => <p style={{fontSize:10+'px'}}>Displaying items {from}-{to} of total {count} items</p>}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
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
