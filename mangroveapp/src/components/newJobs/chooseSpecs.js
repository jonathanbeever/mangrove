import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import '../selectResults/selectResults.css';
import SpecsTable from '../selectResults/specs/specsTable';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';

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
  formControl: {
    // margin: theme.spacing(1),
    // minWidth: 120,
  }
});

class ChooseSpecs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      specInputHtml: '',
      useDefualts: false
    }
  }

  componentDidMount = () => {
    axios.get('http://127.0.0.1:34251/specs')
    .then(res => {
      var specs = {
        'aci': [],
        'ndsi': [],
        'adi': [],
        'aei': [],
        'bi': [],
        'rms': []
      }
      res.data.specs.forEach(spec => {
        specs[spec.type].push(spec)
      })
      // Set all specs state
      this.setState({ allSpecs: res.data.specs })
      this.setState({ indexedSpecs: specs })
    })

    this.formatSpecInput(this.props.specParams[this.props.index])
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if(prevProps !== this.props) {
      this.formatSpecInput(this.props.specParams[this.props.index])
    }
  }

  formatSpecInput = (params) => {
    // Format text field for each parameter
    var specInputHtml = Object.keys(params).map(param => {
      if(param !== 'shannon') {
        if(param === 'maxFreq' && this.props.index === 'aci') {
          return (
            <div key={param} style={{marginBottom: 0, paddingBottom: 0}}>
              <TextField
                label={<h6>{param}</h6>}
                style={{width: '100%'}}
                value={this.props.specParams[this.props.index][param]}
                onChange={this.props.onSpecChange(param)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={params.maxFreq === 'nyquist'}
                    onChange={this.props.onSpecChange(param)}
                    style={{color: '#b6cd26', marginBottom: 0, paddingBottom: 0, marginLeft: '10px'}}
                  />
                }
                label={<h6 style={{marginBottom: 0, paddingBottom: 0}}>Nyquist (sample rate / 2)</h6>}
              />
            </div>
          )
        }
        else return (
          <TextField
            key={param}
            label={<h6>{param}</h6>}
            style={{width: '100%'}}
            value={this.props.specParams[this.props.index][param]}
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
                onChange={this.props.onSpecChange('shannon')}
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
        <h4>Use New Specs</h4>
        {specInputHtml}
      </div>
    )
    this.setState({ specInputHtml: specInputHtml })
  }

  render() {
    const { classes } = this.props;
    axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('id');

    return (
      <div className="row">
        <div className="col-4">
          <Paper className={classes.root}>
            <FormControl className={classes.formControl}>
              {this.state.specInputHtml}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.props.useDefualts}
                    onChange={this.props.useDefaultSpecs}
                    value="default"
                    color="primary"
                  />
                }
                label="Use default parameters"
              />
            </FormControl>
          </Paper>
        </div>
        <div className="col-8">
          <Paper className={classes.root}>
          {this.state.indexedSpecs ?
            <SpecsTable
              index={this.props.index}
              specs={this.state.indexedSpecs[this.props.index]}
              params={Object.keys(this.props.specParams[this.props.index])}
              updateSelectedSpecs={this.props.updateSelectedSpec}
              selectedSpecs={this.props.selectedSpec}
            /> : '' }
          </Paper>
        </div>
      </div>
    );
  }
}

ChooseSpecs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChooseSpecs);
