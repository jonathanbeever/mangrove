import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DateAndTimePickers from '../components/dateTimePicker';
import Button from '@material-ui/core/Button';
import '../selectResults.css';
import InputsTable from './inputsTable';
import Chip from '../components/chip'

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
  }
});

class FilterInputs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chips: ''
    }
  }

  componentDidMount = () => {
    this.formatChipHtml()
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
    this.setState({ chips: <div>{chipHtml}</div> })
  }

  onSubmit = () => {
    this.formatChipHtml()
    this.props.onSubmitInput()
  }

  deleteChip = (label) => {
    this.props.onDelete(label)
    this.formatChipHtml()
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="row">
        <div className="col-4">
          <Paper className={classes.root}>
            {this.state.chips}
            <h4>Filter By Input Files</h4>
            <TextField
              label={<p style={{fontSize:13+'px'}}>Site Name</p>}
              value={this.props.inputFiltering.siteName}
              className={classes.textField}
              onChange={this.props.onChange('siteName')}
            />
            <TextField
              label={<p style={{fontSize:13+'px'}}>File Set Name</p>}
              value={this.props.inputFiltering.setName}
              className={classes.textField}
              onChange={this.props.onChange('setName')}
            />
            {/* TODO */}
            <DateAndTimePickers/>
            <TextField
              label={<p style={{fontSize:13+'px'}}>Latitude</p>}
              value={this.props.inputFiltering.latitude}
              className={classes.textField}
              onChange={this.props.onChange('latitude')}
            />
            <TextField
              label={<p style={{fontSize:13+'px'}}>Longitude</p>}
              value={this.props.inputFiltering.longitude}
              className={classes.textField}
              onChange={this.props.onChange('longitude')}
            />
            <div className="row filterSubmit">
              <Button style={{fontSize:12+'px'}} onClick={this.onSubmit} variant="contained" color="primary">
                Apply Input Filters
              </Button>
            </div>
          </Paper>
        </div>
        <div className="col-8">
          <InputsTable
            updateSelectedInputs={this.props.updateSelectedInputs}
            filteredInputs={this.props.filteredInputs}
            selected={this.props.selected}
          />
        </div>
      </div>
    );
  }
}

FilterInputs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FilterInputs);
