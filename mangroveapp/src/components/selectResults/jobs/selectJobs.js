import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import '../selectResults.css';
import JobsTable from './jobsTable';

const styles = theme => ({
  root: {
    padding: 19,
    marginTop: theme.spacing(3),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: 0,
    marginTop: 0,
    fontWeight: 500
  },
});

class SelectJobs extends Component {
  componentDidMount = () => {
    sessionStorage.removeItem('analysisViewSave');
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="row">
        <div className="col-4">
          <Paper className={classes.root}>
            <h4>Filter Jobs</h4>
            <div>
              <TextField
                label={<p style={{fontSize:13+'px'}}>Author</p>}
                value={this.props.jobFiltering.author}
                className={classes.textField}
                onChange={this.props.onChangeJobFilter('author')}
              />
            </div>
            <div className="row filterSubmit">
              <Button onClick={this.props.onSubmitFiltering} style={{margin: "0 auto"}}>
                <h6>Apply Filters</h6>
              </Button>
            </div>
          </Paper>
        </div>
        <div className="col-8">
          <div>
            <JobsTable
              filteredJobs={this.props.filteredJobs}
              indexedFiles={this.props.indexedFiles}
              updateSelectedJobs={this.props.updateSelectedJobs}
              selectedJobs={this.props.selectedJobs}
              indexedSpecsById={this.props.indexedSpecsById}
            />
            <Button
              style={{marginTop: 7}}
              disabled={!this.props.selectedJobs.length}
              onClick={this.props.sendJobs} >
              <h6>View Results</h6>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

SelectJobs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectJobs);
