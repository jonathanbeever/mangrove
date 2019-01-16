import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import '../selectResults/selectResults.css';
import SpecsTable from '../selectResults/specs/specsTable';

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
  formControl: {
    // margin: theme.spacing.unit,
    // minWidth: 120,
  }
});

class ChooseSpecs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      specInputHtml: '',
  
      
    }
  }

  componentDidMount = () => {
    this.formatSpecInput(this.props.specParams[this.props.index])
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if(prevProps !== this.props) {
      this.formatSpecInput(this.props.specParams[this.props.index])
    }
  }

  formatSpecInput = (params) => {
    const {classes} = this.props
    // Format text field for each parameter
    var specInputHtml = Object.keys(params).map(param => {
      if(param !== 'shannon') {
        return (
          <TextField
            key={param}
            label={param}
            value={this.props.specParams[this.props.index][param]}
            // className={classes.textField}
            onChange={this.props.onSpecChange(param)}
          />   
        )
      }
      else {
        return (
          <FormControlLabel
            key={param}
            control={
              <Checkbox
                checked={params.shannon}
                onChange={this.onSpecChange('shannon')}
                value="shannon"
                color="primary"
              />
            }
            label="Shannon Diversity Index"
          />
        )
      }
    })
    // Add title and submit button to html
    specInputHtml = (
      <div>
        <h4>Define New Specs</h4>
        {specInputHtml} 
        <div className="row filterSubmit">
          {/* <Button onClick={this.onSubmitSpecs} variant="contained" color="primary">
            Apply Spec Choices
          </Button> */}
        </div>
      </div>
    )
    this.setState({ specInputHtml: specInputHtml })
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="row">
        <div className="col-4">
          {/* <Paper className={classes.root}> */}
            <FormControl className={classes.formControl}>
              {this.state.specInputHtml}
            </FormControl>
          {/* </Paper> */}
        </div>
        <div className="col-8">
          {/* <Paper className={classes.root}> */}
          <h4>Choose From Previous Specs</h4>
            <SpecsTable 
              index={this.props.index}
              specs={this.props.specs[this.props.index]}
              params={Object.keys(this.props.specParams[this.props.index])}
              updateSelectedSpecs={this.props.updateSelectedSpec}
              selectedSpecs={this.props.selectedSpec}
            />
          {/* </Paper> */}
        </div>
      </div>
    );
  }
}

ChooseSpecs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChooseSpecs);