import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { sortByKeys } from '../analysisView/dataModeling';
import moment from 'moment';

var _ = require('lodash');
const { Parser } = require('json2csv');

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
});

class ExportCsv extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      separateCsvs: false,
      showFields: {
        aci: {
          fileName: {label:'FILENAME', value: 'input.name', stringify: true, show: true},
          sampleRateHz: {label:'SAMPLE_RATE', value: 'input.sampleRateHz', stringify: true, show: true},
          sizeBytes: {label:'SIZE_BYTES', value: 'input.sizeBytes', stringify: true, show: true},
          durationMs: {label:'DURATION', value: 'input.durationMs', stringify: true, show: true},
          recordTimeMs: {label:'RECORD_TIME', value: 'input.recordTimeMs', show: true},
          lat: {label:'LAT', value: 'input.coords.lat', stringify: true, show: true},
          long: {label:'LONG', value: 'input.coords.long', stringify: true, show: true},
          index: {label:'INDEX', value: 'spec.type', stringify: true, show: true, type: 'param'},
          minFreq: {label:'MIN_FREQ', value: 'spec.minFreq', stringify: true, show: true, type: 'param'},
          maxFreq: {label:'MAX_FREQ', value: 'spec.maxFreq', stringify: true, show: true, type: 'param'},
          j: {label:'J', value: 'spec.j', stringify: true, show: true, type: 'param'},
          fftW: {label:'FFT_W', value: 'spec.fftW', stringify: true, show: true, type: 'param'},
          aciTotAllL: {label:'ACI_TOT_ALL_L', value: 'result.aciTotAllL', stringify: true, show: true, type: 'result'},
          aciTotAllR: {label:'ACI_TOT_ALL_R', value: 'result.aciTotAllR', stringify: true, show: true, type: 'result'},
          aciTotAllByMinL: {label:'ACI_TOT_ALL_BY_MIN_L', value: 'result.aciTotAllByMinL', stringify: true, show: true, type: 'result'},
          aciTotAllByMinR: {label:'ACI_TOT_ALL_BY_MIN_R', value: 'result.aciTotAllByMinR', stringify: true, show: true, type: 'result'}
          // aciFlVals, aciMatrix
        },
        ndsi: {
          fileName: {label:'FILENAME', value: 'input.name', stringify: true, show: true},
          sampleRateHz: {label:'SAMPLE_RATE', value: 'input.sampleRateHz', stringify: true, show: true},
          sizeBytes: {label:'SIZE_BYTES', value: 'input.sizeBytes', stringify: true, show: true},
          durationMs: {label:'DURATION', value: 'input.durationMs', stringify: true, show: true},
          recordTimeMs: {label:'RECORD_TIME', value: 'input.recordTimeMs', show: true},
          lat: {label:'LAT', value: 'input.coords.lat', stringify: true, show: true},
          long: {label:'LONG', value: 'input.coords.long', stringify: true, show: true},
          index: {label:'INDEX', value: 'spec.type', stringify: true, show: true, type: 'param'},
          bioMin: {label:'BIO_MIN', value: 'spec.bioMin', stringify: true, show: true, type: 'param'},
          bioMax: {label:'BIO_MAX', value: 'spec.bioMax', stringify: true, show: true, type: 'param'},
          anthroMin: {label:'ANTHRO_MIN', value: 'spec.anthroMin', stringify: true, show: true, type: 'param'},
          anthroMax: {label:'ANTHRO_MAX', value: 'spec.anthroMax', stringify: true, show: true, type: 'param'},          
          fftW: {label:'FFT_W', value: 'spec.fftW', stringify: true, show: true, type: 'param'},
          ndsiL: {label:'NDSI_L', value: 'result.ndsiL', stringify: true, show: true, type: 'result'},
          ndsiR: {label:'NDSI_R', value: 'result.ndsiR', stringify: true, show: true, type: 'result'},
          bioL: {label:'BIOPHONY_L', value: 'result.biophonyL', stringify: true, show: true, type: 'result'},
          bioR: {label:'BIOPHONY_R', value: 'result.biophonyR', stringify: true, show: true, type: 'result'},
          anthroL: {label:'ANTHROPHONY_L', value: 'result.anthrophonyL', stringify: true, show: true, type: 'result'},
          anthroR: {label:'ANTHROPHONY_R', value: 'result.anthrophonyR', stringify: true, show: true, type: 'result'}
        },
        adi: {
          fileName: {label:'FILENAME', value: 'input.name', stringify: true, show: true},
          sampleRateHz: {label:'SAMPLE_RATE', value: 'input.sampleRateHz', stringify: true, show: true},
          sizeBytes: {label:'SIZE_BYTES', value: 'input.sizeBytes', stringify: true, show: true},
          durationMs: {label:'DURATION', value: 'input.durationMs', stringify: true, show: true},
          recordTimeMs: {label:'RECORD_TIME', value: 'input.recordTimeMs', show: true},
          lat: {label:'LAT', value: 'input.coords.lat', stringify: true, show: true},
          long: {label:'LONG', value: 'input.coords.long', stringify: true, show: true},
          index: {label:'INDEX', value: 'spec.type', stringify: true, show: true, type: 'param'},
          maxFreq: {label:'MAX_FREQ', value: 'spec.maxFreq', stringify: true, show: true, type: 'param'},
          dbThreshold: {label:'DB_THRESHOLD', value: 'spec.dbThreshold', stringify: true, show: true, type: 'param'},
          freqStep: {label:'FREQ_STEP', value: 'spec.freqStep', stringify: true, show: true, type: 'param'},
          shannon: {label:'SHANNON', value: 'spec.shannon', stringify: true, show: true, type: 'param'},
          adiL: {label:'ADI_L', value: 'result.adiL', stringify: true, show: true, type: 'result'},
          adiR: {label:'ADI_R', value: 'result.adiR', stringify: true, show: true, type: 'result'}
          // {label:'BAND_L', value: 'result.bandL', stringify: true},
          // {label:'BAND_R', value: 'result.bandR', stringify: true}
        },
        aei: {
          fileName: {label:'FILENAME', value: 'input.name', stringify: true, show: true},
          sampleRateHz: {label:'SAMPLE_RATE', value: 'input.sampleRateHz', stringify: true, show: true},
          sizeBytes: {label:'SIZE_BYTES', value: 'input.sizeBytes', stringify: true, show: true},
          durationMs: {label:'DURATION', value: 'input.durationMs', stringify: true, show: true},
          recordTimeMs: {label:'RECORD_TIME', value: 'input.recordTimeMs', show: true},
          lat: {label:'LAT', value: 'input.coords.lat', stringify: true, show: true},
          long: {label:'LONG', value: 'input.coords.long', stringify: true, show: true},
          index: {label:'INDEX', value: 'spec.type', stringify: true, show: true, type: 'param'},
          maxFreq: {label:'MAX_FREQ', value: 'spec.maxFreq', stringify: true, show: true, type: 'param'},
          dbThreshold: {label:'DB_THRESHOLD', value: 'spec.dbThreshold', stringify: true, show: true, type: 'param'},
          freqStep: {label:'FREQ_STEP', value: 'spec.freqStep', stringify: true, show: true, type: 'param'},
          aeiL: {label:'AEI_L', value: 'result.aeiL', stringify: true, show: true, type: 'result'},
          aeiR: {label:'AEI_R', value: 'result.aeiR', stringify: true, show: true, type: 'result'}
        },
        bi: {
          fileName: {label:'FILENAME', value: 'input.name', stringify: true, show: true},
          sampleRateHz: {label:'SAMPLE_RATE', value: 'input.sampleRateHz', stringify: true, show: true},
          sizeBytes: {label:'SIZE_BYTES', value: 'input.sizeBytes', stringify: true, show: true},
          durationMs: {label:'DURATION', value: 'input.durationMs', stringify: true, show: true},
          recordTimeMs: {label:'RECORD_TIME', value: 'input.recordTimeMs', show: true},
          lat: {label:'LAT', value: 'input.coords.lat', stringify: true, show: true},
          long: {label:'LONG', value: 'input.coords.long', stringify: true, show: true},
          index: {label:'INDEX', value: 'spec.type', stringify: true, show: true, type: 'param'},
          minFreq: {label:'MIN_FREQ', value: 'spec.minFreq', stringify: true, show: true, type: 'param'},
          maxFreq: {label:'MAX_FREQ', value: 'spec.maxFreq', stringify: true, show: true, type: 'param'},
          fftW: {label:'FFT_W', value: 'spec.fftW', stringify: true, show: true, type: 'param'},
          areaL: {label:'AREA_L', value: 'result.areaL', stringify: true, show: true, type: 'result'},
          areaR: {label:'AREA_R', value: 'result.areaR', stringify: true, show: true, type: 'result'}
        },
        rms: {
          fileName: {label:'FILENAME', value: 'input.name', stringify: true, show: true},
          sampleRateHz: {label:'SAMPLE_RATE', value: 'input.sampleRateHz', stringify: true, show: true},
          sizeBytes: {label:'SIZE_BYTES', value: 'input.sizeBytes', stringify: true, show: true},
          durationMs: {label:'DURATION', value: 'input.durationMs', stringify: true, show: true},
          recordTimeMs: {label:'RECORD_TIME', value: 'input.recordTimeMs', show: true},
          lat: {label:'LAT', value: 'input.coords.lat', stringify: true, show: true},
          long: {label:'LONG', value: 'input.coords.long', stringify: true, show: true},
          index: {label:'INDEX', value: 'spec.type', stringify: true, show: true, type: 'param'},
          rmsL: {label:'RMS_L', value: 'result.rmsL', stringify: true, show: true, type: 'result'},
          rmsR: {label:'RMS_R', value: 'result.rmsR', stringify: true, show: true, type: 'result'}
        }
      }
    }
  }

  componentDidMount = () => {
    var sortedJobs = sortByKeys(this.props.jobs, 'input', 'recordTimeMs')
    console.log(sortedJobs)
    this.setState({ sortedJobs: sortedJobs })
    this.setModalHtml()
  }
  
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if(prevProps !== this.props) {
      console.log(this.props)
    }
  }

  setModalHtml = () => {
    var inputCheckBoxes = []
    var paramCheckBoxes = []
    var resultCheckBoxes = []

    Object.keys(this.state.showFields[this.props.index]).forEach(field => {
      if(this.state.showFields[this.props.index][field]['type'] === 'param')
      paramCheckBoxes.push(
        <FormControlLabel
          key={this.state.showFields[this.props.index][field]['label']}
          control={
            <Checkbox
              checked={this.state.showFields[this.props.index][field]['show']}
              onChange={this.handleChange(field)}
              value={this.state.showFields[this.props.index][field]['label']}
              color="primary"
            />
          }
          label={field}
        />
      )
      else if(this.state.showFields[this.props.index][field]['type'] === 'result')
      resultCheckBoxes.push(
        <FormControlLabel
          key={this.state.showFields[this.props.index][field]['label']}
          control={
            <Checkbox
              checked={this.state.showFields[this.props.index][field]['show']}
              onChange={this.handleChange(field)}
              value={this.state.showFields[this.props.index][field]['label']}
              color="primary"
            />
          }
          label={field}
        />
      )
      else
      inputCheckBoxes.push(
        <FormControlLabel
          key={this.state.showFields[this.props.index][field]['label']}
          control={
            <Checkbox
              checked={this.state.showFields[this.props.index][field]['show']}
              onChange={this.handleChange(field)}
              value={this.state.showFields[this.props.index][field]['label']}
              color="primary"
            />
          }
          label={field}
        />
      )
    })

    var modalHtml = (
      <div>
        <h5>Select {this.props.index.toUpperCase()} fields to list in CSV</h5>
        <h6>Input Fields</h6>
        <FormGroup row>
          {inputCheckBoxes}
        </FormGroup>
        <h6>Parameter Fields</h6>
        <FormGroup row>
          {paramCheckBoxes}
        </FormGroup>
        <h6>Result Fields</h6>
        <FormGroup row>
          {resultCheckBoxes}
        </FormGroup>
      </div>
    )
    this.setState({ modalHtml: modalHtml })
  }

  handleChange = (name) => e => {
    var fields = this.state.showFields
    fields[this.props.index][name]['show'] = e.target.checked

    this.setState({ showFields: fields })
    this.setModalHtml()
  }

  convertJobsData = () => {
    var fields = _.cloneDeep(this.state.showFields[this.props.index])
    Object.keys(fields).forEach(fieldName => {
      if(fields[fieldName]['show'] === false){
        delete fields[fieldName]
      }
      else {
        delete fields[fieldName]['show']
        if(fields[fieldName]['type'] !== undefined)
          delete fields[fieldName]['type']
      }
    })

    fields = Object.values(fields)
    const json2csvParser = new Parser({ fields });

    var dateFormattedJobs = _.cloneDeep(this.state.sortedJobs)
    dateFormattedJobs.map(job => {
      job['input']['recordTimeMs'] = moment(job['input']['recordTimeMs']).format('MM/DD/YY, HH:mm:ss')
    })

    const csv = json2csvParser.parse(dateFormattedJobs);

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = this.props.site + '-' + this.props.series + '-' + this.props.index +'.csv';
    hiddenElement.click();
  }

  openModal = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="row" style={{textAlign: 'right', float: 'right'}}>
        <div>
          <Button
            onClick={this.openModal}
            style={{width: 160+'px', marginRight: 35+'px'}}
          >
            Convert to CSV
          </Button>
        </div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div className={classes.paper} style={getModalStyle()}>
            {this.state.modalHtml}
            <Button
              onClick={this.convertJobsData}
            >
              Download
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

ExportCsv.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExportCsv);
