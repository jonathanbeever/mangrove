import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DateAndTimePickers from './dateTimePicker';
import Button from '@material-ui/core/Button';
import './selectResults.css';
import InputsTable from './inputsTable.js';
import Chip from './chip'

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
      chips: ''
    }
  }

  componentDidMount = () => {
    console.log(this.props)
    this.formatChipHtml()
  }
  
  deleteChip = (label) => {
    this.props.onDelete(label)
    this.setState({ chips : '' })
  }

  formatChipHtml = () => {
    var chipHtml = []
    Object.keys(this.props.inputFiltering).forEach(param => {
      if(this.props.inputFiltering[param].length) {
        chipHtml.push(
          <Chip
            key={param}
            label={param + ' : ' + this.props.inputFiltering[param]}
            
            onDelete={this.deleteChip}
          />
        )
      }
    })
    console.log(chipHtml)
    this.setState({ chips: <div>{chipHtml}</div> })
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="row">
                  {this.state.chips}

      </div>
    );
  }
}

SelectJobs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectJobs);