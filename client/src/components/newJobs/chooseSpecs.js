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
      specParams: {
        aci: {
          minFreq: '',
          maxFreq: '',
          j: '',
          fftW: ''
        },
        ndsi: {
          anthroMin: '',
          anthroMax: '',
          bioMin: '',
          bioMax: '',
          fftW: ''
        },
        adi: {
          maxFreq: '',
          dbThreshold: '',
          freqStep: '',
          shannon: false
        },
        aei: {
          maxFreq: '',
          dbThreshold: '',
          freqStep: ''
        },
        bi: {
          minFreq: '',
          maxFreq: '',
          fftW: ''
        },
        rms: {
          test: ''
        }
      }
      
    }
  }

  componentDidMount = () => {
    axios.get('http://localhost:3000/specs')
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
        <h5>Define New Specs</h5>
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
          <Paper className={classes.root}>
            <FormControl className={classes.formControl}>
              {this.state.specInputHtml}
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