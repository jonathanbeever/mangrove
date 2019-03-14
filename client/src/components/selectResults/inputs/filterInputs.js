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
    sessionStorage.removeItem('analysisViewSave');
    this.formatChipHtml()
  }

  formatChipHtml = () => {
    var chipHtml = []
    Object.keys(this.props.inputFiltering).forEach(param => {
      if(this.props.inputFiltering[param].length) {
        chipHtml.push(
          <Chip
            key={param}
            label={<h4>{param + ' : ' + this.props.inputFiltering[param]}</h4>}
            onDelete={this.deleteChip}
          />
        )
      }
    })
    this.setState({ chips: <h3>{chipHtml}</h3> })
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
              value={this.props.inputFiltering.site}
              className={classes.textField}
              onChange={this.props.onChange('site')}
            />
            <TextField
              label={<p style={{fontSize:13+'px'}}>File Set Name</p>}
              value={this.props.inputFiltering.series}
              className={classes.textField}
              onChange={this.props.onChange('series')}
            />
            {/* TODO */}
            <DateAndTimePickers/>
            <TextField
              label={<p style={{fontSize:13+'px'}}>Latitude</p>}
              value={this.props.inputFiltering.lat}
              className={classes.textField}
              onChange={this.props.onChange('lat')}
            />
            <TextField
              label={<p style={{fontSize:13+'px'}}>Longitude</p>}
              value={this.props.inputFiltering.long}
              className={classes.textField}
              onChange={this.props.onChange('long')}
            />
            <div className="row filterSubmit">
              <Button onClick={this.onSubmit} style={{margin: "0 auto"}}>
                <h6>Apply Filters</h6>
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
