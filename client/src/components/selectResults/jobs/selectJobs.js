import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DateAndTimePickers from '../components/dateTimePicker';
import Button from '@material-ui/core/Button';
import '../selectResults.css';
import Chip from '../components/chip';
import JobsTable from './jobsTable';

const styles = theme => ({
  root: {
    padding: 19,
    marginTop: theme.spacing.unit * 3,
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

  constructor(props) {
    super(props);
    this.state = {
      inputChips: '',
      specChips: ''
    }
  }

  componentDidMount = () => {
    this.formatInputChipHtml()
    this.formatSpecFilterHtml()
  }

  componentDidUpdate = (prevProps) => {
    if(prevProps.inputFiltering !== this.props.inputFiltering) {
      this.formatInputChipHtml()
    }
  }
  
  deleteInputChip = (label) => {
    this.props.onDelete(label)
    this.formatInputChipHtml()
  }

  formatInputChipHtml = () => {
    var chipHtml = []
    Object.keys(this.props.inputFiltering).forEach(param => {
      if(this.props.inputFiltering[param].length) {
        chipHtml.push(
          <Chip
            key={param}
            label={param + ' : ' + this.props.inputFiltering[param]}
            onDelete={this.deleteInputChip}
          />
        )
      }
    })
    if(chipHtml.length)
      this.setState({ inputChips: <div>{chipHtml}</div> })
    else
      this.setState({ inputChips: '' })
  }

  deleteSpecChip = (label) => {
    this.props.onDeleteSpecChip(label)
    this.formatSpecChipHtml()
  }

  formatSpecFilterHtml = () => {
    var html = ''
    var html2 = ''
    if(this.props.selectedIndex.length) {
      html = <h5><strong>Index: </strong>{this.props.selectedIndex}</h5>
      // change from array if keeping pne spec
      if(this.props.selectedSpecs[this.props.selectedIndex][0] === this.props.filteredSpecs[this.props.selectedIndex][0].specId) {
        html2 = Object.keys(this.props.filteredSpecs[this.props.selectedIndex][0]).map(param => {
          if(param !== 'specId' && param !== 'type')
            return <div key={param}>{param + ': ' + this.props.filteredSpecs[this.props.selectedIndex][0][param]}</div>
          else
            return null;
        })
      }
      html = <div>{html}<div>{html2}</div></div>
    }
    this.setState({ specHtml: html })
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="row">
        <div className="col-4">
          {this.props.selectedIndex.length ? 
            <Paper className={classes.root}>
              {/* <div className="row"> */}
                {this.state.specHtml}
              {/* </div> */}
            </Paper>
          :
            ''
          }
          {this.state.inputChips !== '' ? 
            <Paper className={classes.root}>
              <h5>Input Specifications</h5>
              {this.state.inputChips}
            </Paper>
          :
            ''
          }
          <Paper className={classes.root}>
            <div>
              <TextField
                label="Author"
                value={this.props.jobFiltering.author}
                className={classes.textField}
                onChange={this.props.onChangeJobFilter('author')}
              />
              {/* TODO */}
              <DateAndTimePickers />
            </div>
          </Paper>
          <div className="row filterSubmit">
            <Button onClick={this.props.onSubmitFiltering} variant="contained" color="primary">
              Apply Job Filters
            </Button>
          </div>
        </div>
        <div className="col-8">
          {this.props.selectedIndex ? 
            <div>
              <JobsTable 
                filteredJobs={this.props.filteredJobs}
                indexedFiles={this.props.indexedFiles}    
                updateSelectedJobs={this.props.updateSelectedJobs}
                selectedJobs={this.props.selectedJobs}
              />
              <Button  color="primary" disabled={!this.props.selectedJobs.length} onClick={this.props.sendJobs} >
                View Results
              </Button>
            </div>
          :
            <Paper className={classes.root}><h5>Please Select an Index and Parameter Specifications</h5></Paper>
          }
          
        </div>  
      </div>
    );
  }
}

SelectJobs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectJobs);