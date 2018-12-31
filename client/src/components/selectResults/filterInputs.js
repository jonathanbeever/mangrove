import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import DateAndTimePickers from './dataTimePicker';
import Button from '@material-ui/core/Button';
import './selectResults.css';
import InputsTable from './inputsTable.js';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
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
    return (
      <div className="row">
      <div className="col-4">
        <h5>Filter By Input Files</h5>
        <TextField
          label="Site Name"
          value={this.props.siteName}
          onChange={this.props.onChangeInput('siteName')}
        />
        <TextField
          label="File Set Name"
          value={this.props.setname}
          onChange={this.props.onChangeInput('setName')}
        />
        {/* TODO */}
        <DateAndTimePickers />
        <TextField
          label="Latitude"
          value={this.props.latitude}
          onChange={this.props.onChangeInput('latitude')}
        />
        <TextField
          label="Longitude"
          value={this.props.longitude}
          onChange={this.props.onChangeInput('longitude')}
        />
        <div className="row filterSubmit">
        <Button onClick={this.props.onSubmitInput} variant="contained" color="primary">
          Apply Input Filters
        </Button>
        </div>
        
      </div>
      <div className="col-8">
        <InputsTable filteredInputs={this.props.filteredInputs}/>
      </div>
      </div>
    );
  }
}

export default FilterInputs;