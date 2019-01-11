import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DateAndTimePickers from './dateTimePicker';
import Button from '@material-ui/core/Button';
import './selectResults.css';
import InputsTable from './inputsTable.js';
import Chip from './chip';
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
    this.formatSpecChipHtml()
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
    this.setState({ inputChips: <div>{chipHtml}</div> })
  }

  deleteSpecChip = (label) => {
    this.props.onDeleteSpecChip(label)
    this.formatSpecChipHtml()
  }

  formatSpecChipHtml = () => {
    var chipHtml = []
    var indices = ['aci', 'ndsi']
    indices.forEach(index => {
      Object.keys(this.props.specParamsByIndex[index]).forEach(param => {
        if(this.props.specParamsByIndex[index][param].length) {
          chipHtml.push(
            <Chip
              key={param}
              label={index + ' : ' + param + ' - ' + this.props.specParamsByIndex[index][param]}
              onDelete={this.deleteSpecChip}
            />
          )
        }
      })
      this.setState({ specChips: <div>{chipHtml}</div> })
    })

  }

  render() {
    const { classes } = this.props;

    return (
      <div className="row">
        <div className="col-4">
          <Paper className={classes.root}>
          <div className="row">
            <div className="col-6">
              Input Specifications
              {this.state.inputChips}
            </div>
            <div className="col-6">
              Parameter Specifications
              {this.state.specChips}
            </div>
            </div>
          </Paper>
        </div>
        <div className="col-8">
          <JobsTable 
            filteredJobs={this.props.filteredJobs}
            indexedFiles={this.props.indexedFiles}    
            updateSelectedJobs={this.props.updateSelectedJobs}
            selectedJobs={this.props.selectedJobs}
          />
        </div>
      </div>
    );
  }
}

SelectJobs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectJobs);