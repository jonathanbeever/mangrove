import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import DateAndTimePickers from './dataTimePicker';
import Button from '@material-ui/core/Button';
import './selectResults.css';
import InputsTable from './inputsTable.js';

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

class FilterInputs extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    console.log(this.props)
  }
  render() {
    const { classes } = this.props;

    return (
      <div className="row">
        <div className="col-4">

      <Paper className={classes.root}>

          <h5>Filter By Input Files</h5>
          <TextField
            label="Site Name"
            value={this.props.siteName}
            className={classes.textField}
            onChange={this.props.onChangeInput('siteName')}
          />
          <TextField
            label="File Set Name"
            value={this.props.setname}
            className={classes.textField}
            onChange={this.props.onChangeInput('setName')}
          />
          {/* TODO */}
          <DateAndTimePickers />
          <TextField
            label="Latitude"
            value={this.props.latitude}
            className={classes.textField}
            onChange={this.props.onChangeInput('latitude')}
          />
          <TextField
            label="Longitude"
            value={this.props.longitude}
            className={classes.textField}
            onChange={this.props.onChangeInput('longitude')}
          />
          <div className="row filterSubmit">
            <Button onClick={this.props.onSubmitInput} variant="contained" color="primary">
              Apply Input Filters
            </Button>
          </div>
        </Paper>
        </div>

        <div className="col-8">
          <InputsTable updateSelectedInputs={this.props.updateSelectedInputs} filteredInputs={this.props.filteredInputs}/>
        </div>
      </div>
    );
  }
}

FilterInputs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FilterInputs);