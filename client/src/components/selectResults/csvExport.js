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
          fileName: {label:'FILENAME', value: 'input.name', show: true},
          sampleRateHz: {label:'SAMPLE_RATE', value: 'input.sampleRateHz', show: true},
          sizeBytes: {label:'SIZE_BYTES', value: 'input.sizeBytes', show: true},
          durationMs: {label:'DURATION', value: 'input.durationMs', show: true},
          recordTimeMs: {label:'RECORD_TIME', value: 'input.recordTimeMs', show: true},
          lat: {label:'LAT', value: 'input.coords.lat', show: true},
          long: {label:'LONG', value: 'input.coords.long', show: true},
          index: {label:'INDEX', value: 'spec.type', show: true, type: 'param'},
          minFreq: {label:'MIN_FREQ', value: 'spec.minFreq', show: true, type: 'param'},
          maxFreq: {label:'MAX_FREQ', value: 'spec.maxFreq', show: true, type: 'param'},
          j: {label:'J', value: 'spec.j', show: true, type: 'param'},
          fftW: {label:'FFT_W', value: 'spec.fftW', show: true, type: 'param'},
          aciTotAllL: {label:'ACI_TOT_ALL_L', value: 'result.aciTotAllL', show: true, type: 'result'},
          aciTotAllR: {label:'ACI_TOT_ALL_R', value: 'result.aciTotAllR', show: true, type: 'result'},
          aciTotAllByMinL: {label:'ACI_TOT_ALL_BY_MIN_L', value: 'result.aciTotAllByMinL', show: true, type: 'result'},
          aciTotAllByMinR: {label:'ACI_TOT_ALL_BY_MIN_R', value: 'result.aciTotAllByMinR', show: true, type: 'result'},
          aciFlValsL: {label:'ACI_FL_VALS_L', value: 'result.aciFlValsL', show: false, type: 'result', disabled: true},
          aciFlValsR: {label:'ACI_FL_VALS_R', value: 'result.aciFlValsR', show: false, type: 'result', disabled: true},
          aciOverTimeL: {label:'ACI_OVERTIME_L', value: 'result.aciOverTimeL', show: false, type: 'result', disabled: true},
          aciOverTimeR: {label:'ACI_OVERTIME_R', value: 'result.aciOverTimeR', show: false, type: 'result', disabled: true}
        },
        ndsi: {
          fileName: {label:'FILENAME', value: 'input.name', show: true},
          sampleRateHz: {label:'SAMPLE_RATE', value: 'input.sampleRateHz', show: true},
          sizeBytes: {label:'SIZE_BYTES', value: 'input.sizeBytes', show: true},
          durationMs: {label:'DURATION', value: 'input.durationMs', show: true},
          recordTimeMs: {label:'RECORD_TIME', value: 'input.recordTimeMs', show: true},
          lat: {label:'LAT', value: 'input.coords.lat', show: true},
          long: {label:'LONG', value: 'input.coords.long', show: true},
          index: {label:'INDEX', value: 'spec.type', show: true, type: 'param'},
          bioMin: {label:'BIO_MIN', value: 'spec.bioMin', show: true, type: 'param'},
          bioMax: {label:'BIO_MAX', value: 'spec.bioMax', show: true, type: 'param'},
          anthroMin: {label:'ANTHRO_MIN', value: 'spec.anthroMin', show: true, type: 'param'},
          anthroMax: {label:'ANTHRO_MAX', value: 'spec.anthroMax', show: true, type: 'param'},
          fftW: {label:'FFT_W', value: 'spec.fftW', show: true, type: 'param'},
          ndsiL: {label:'NDSI_L', value: 'result.ndsiL', show: true, type: 'result'},
          ndsiR: {label:'NDSI_R', value: 'result.ndsiR', show: true, type: 'result'},
          bioL: {label:'BIOPHONY_L', value: 'result.biophonyL', show: true, type: 'result'},
          bioR: {label:'BIOPHONY_R', value: 'result.biophonyR', show: true, type: 'result'},
          anthroL: {label:'ANTHROPHONY_L', value: 'result.anthrophonyL', show: true, type: 'result'},
          anthroR: {label:'ANTHROPHONY_R', value: 'result.anthrophonyR', show: true, type: 'result'}
        },
        adi: {
          fileName: {label:'FILENAME', value: 'input.name', show: true},
          sampleRateHz: {label:'SAMPLE_RATE', value: 'input.sampleRateHz', show: true},
          sizeBytes: {label:'SIZE_BYTES', value: 'input.sizeBytes', show: true},
          durationMs: {label:'DURATION', value: 'input.durationMs', show: true},
          recordTimeMs: {label:'RECORD_TIME', value: 'input.recordTimeMs', show: true},
          lat: {label:'LAT', value: 'input.coords.lat', show: true},
          long: {label:'LONG', value: 'input.coords.long', show: true},
          index: {label:'INDEX', value: 'spec.type', show: true, type: 'param'},
          maxFreq: {label:'MAX_FREQ', value: 'spec.maxFreq', show: true, type: 'param'},
          dbThreshold: {label:'DB_THRESHOLD', value: 'spec.dbThreshold', show: true, type: 'param'},
          freqStep: {label:'FREQ_STEP', value: 'spec.freqStep', show: true, type: 'param'},
          shannon: {label:'SHANNON', value: 'spec.shannon', show: true, type: 'param'},
          adiL: {label:'ADI_L', value: 'result.adiL', show: true, type: 'result'},
          adiR: {label:'BAND_L', value: 'result.bandL', show: true, type: 'result'},
          bandL: {label:'BAND_L', value: 'result.bandL', show: false, type: 'result', disabled: true},
          bandR: {label:'BAND_R', value: 'result.bandR', show: false, type: 'result', disabled: true},
          bandRangeL: {label:'BAND_RANGE_L', value: 'result.bandRangeL', show: false, type: 'result', disabled: true},
          bandRangeR: {label:'BAND_RANGE_R', value: 'result.bandRangeR', show: false, type: 'result', disabled: true}
        },
        aei: {
          fileName: {label:'FILENAME', value: 'input.name', show: true},
          sampleRateHz: {label:'SAMPLE_RATE', value: 'input.sampleRateHz', show: true},
          sizeBytes: {label:'SIZE_BYTES', value: 'input.sizeBytes', show: true},
          durationMs: {label:'DURATION', value: 'input.durationMs', show: true},
          recordTimeMs: {label:'RECORD_TIME', value: 'input.recordTimeMs', show: true},
          lat: {label:'LAT', value: 'input.coords.lat', show: true},
          long: {label:'LONG', value: 'input.coords.long', show: true},
          index: {label:'INDEX', value: 'spec.type', show: true, type: 'param'},
          maxFreq: {label:'MAX_FREQ', value: 'spec.maxFreq', show: true, type: 'param'},
          dbThreshold: {label:'DB_THRESHOLD', value: 'spec.dbThreshold', show: true, type: 'param'},
          freqStep: {label:'FREQ_STEP', value: 'spec.freqStep', show: true, type: 'param'},
          aeiL: {label:'AEI_L', value: 'result.aeiL', show: true, type: 'result'},
          aeiR: {label:'AEI_R', value: 'result.aeiR', show: true, type: 'result'}
        },
        bi: {
          fileName: {label:'FILENAME', value: 'input.name', show: true},
          sampleRateHz: {label:'SAMPLE_RATE', value: 'input.sampleRateHz', show: true},
          sizeBytes: {label:'SIZE_BYTES', value: 'input.sizeBytes', show: true},
          durationMs: {label:'DURATION', value: 'input.durationMs', show: true},
          recordTimeMs: {label:'RECORD_TIME', value: 'input.recordTimeMs', show: true},
          lat: {label:'LAT', value: 'input.coords.lat', show: true},
          long: {label:'LONG', value: 'input.coords.long', show: true},
          index: {label:'INDEX', value: 'spec.type', show: true, type: 'param'},
          minFreq: {label:'MIN_FREQ', value: 'spec.minFreq', show: true, type: 'param'},
          maxFreq: {label:'MAX_FREQ', value: 'spec.maxFreq', show: true, type: 'param'},
          fftW: {label:'FFT_W', value: 'spec.fftW', show: true, type: 'param'},
          areaL: {label:'AREA_L', value: 'result.areaL', show: true, type: 'result'},
          areaR: {label:'AREA_R', value: 'result.areaR', show: true, type: 'result'}
        },
        rms: {
          fileName: {label:'FILENAME', value: 'input.name', show: true},
          sampleRateHz: {label:'SAMPLE_RATE', value: 'input.sampleRateHz', show: true},
          sizeBytes: {label:'SIZE_BYTES', value: 'input.sizeBytes', show: true},
          durationMs: {label:'DURATION', value: 'input.durationMs', show: true},
          recordTimeMs: {label:'RECORD_TIME', value: 'input.recordTimeMs', show: true},
          lat: {label:'LAT', value: 'input.coords.lat', show: true},
          long: {label:'LONG', value: 'input.coords.long', show: true},
          index: {label:'INDEX', value: 'spec.type', show: true, type: 'param'},
          rmsL: {label:'RMS_L', value: 'result.rmsL', show: true, type: 'result'},
          rmsR: {label:'RMS_R', value: 'result.rmsR', show: true, type: 'result'}
        }
      }
    }
  }

  componentDidMount = () => {
    var sortedJobs = sortByKeys(this.props.jobs, 'input', 'recordTimeMs')
    this.setState({ sortedJobs: sortedJobs })

    this.setModalHtml()
  }

  setModalHtml = () => {
    var inputCheckBoxes = []
    var paramCheckBoxes = []
    var resultCheckBoxes = []

    Object.keys(this.state.showFields[this.props.index]).forEach(field => {
      var currField = this.state.showFields[this.props.index][field]

      if(currField['type'] === 'param')
        paramCheckBoxes.push(
          <FormControlLabel
            key={currField['label']}
            control={
              <Checkbox
                checked={currField['show']}
                onChange={this.handleChange(field)}
                value={currField['label']}
                color="primary"
              />
            }
            label={field}
          />
        )
      else if(currField['type'] === 'result') {
        var disabled;
        if(currField['disabled'] !== undefined) disabled = currField['disabled']
        else disabled = false

        resultCheckBoxes.push(
          <FormControlLabel
            key={currField['label']}
            control={
              <Checkbox
                checked={currField['show']}
                disabled={disabled}
                onChange={this.handleChange(field)}
                value={currField['label']}
                color="primary"
              />
            }
            label={field}
          />
        )
      }
      else {
        inputCheckBoxes.push(
          <FormControlLabel
            key={currField['label']}
            control={
              <Checkbox
                checked={currField['show']}
                onChange={this.handleChange(field)}
                value={currField['label']}
                color="primary"
              />
            }
            label={field}
          />
        )
      }
    })

    var modalHtml = (
      <div>
        <h5>Select {this.props.index.toUpperCase()} fields to list in CSV</h5>
        <hr/>
        <h5>Input Fields</h5>
        <FormGroup row>
          {inputCheckBoxes}
        </FormGroup>
        <h5>Parameter Fields</h5>
        <FormGroup row>
          {paramCheckBoxes}
        </FormGroup>
        <h5>Result Fields</h5>
        {this.props.index === 'aci' ?
          <h6>AciFlVals(L/R) and AciOverTime(L/R) can only be exported to a single job CSV file.</h6>
          :
          (this.props.index === 'adi' ?
            <p></p>
            :
            ''
          )
        }
        <FormGroup row>
          {resultCheckBoxes}
        </FormGroup>
      </div>
    )
    this.setState({ modalHtml: modalHtml })
  }

  handleChange = (name) => e => {
    var fields = this.state.showFields
    if(name === 'separateCsvs') {
      if(this.props.index === 'aci') {
        ['aciFlValsL', 'aciFlValsR', 'aciOverTimeL', 'aciOverTimeR'].forEach(field => {
          if(!e.target.checked) {
            fields[this.props.index][field]['show'] = e.target.checked
          }
          fields[this.props.index][field]['disabled'] = !e.target.checked
        })

      }
      else if(this.props.index === 'adi') {
        ['bandL', 'bandR', 'bandRangeL', 'bandRangeR'].forEach(field => {
          if(!e.target.checked) {
            fields[this.props.index][field]['show'] = e.target.checked
          }
          fields[this.props.index][field]['disabled'] = !e.target.checked
        })
      }

      this.setState({
        [name]: e.target.checked,
        showFields: fields
      }, () => {
        this.setModalHtml()
      })
    }
    else {
      fields[this.props.index][name]['show'] = e.target.checked

      if(this.props.index === 'aci') {
        var aciSingleFields = ['aciOverTimeL', 'aciOverTimeR', 'aciFlValsL', 'aciFlValsR']

        if(aciSingleFields.indexOf(name) !== -1) {
          aciSingleFields.splice(aciSingleFields.indexOf(name), 1)

          aciSingleFields.forEach(field => {
            fields[this.props.index][field]['disabled'] = e.target.checked
            fields[this.props.index][field]['show'] = false
          })
        }
      }

      this.setState({
        showFields: fields
      }, () => {
        this.setModalHtml()
      })
    }
  }

  jobSetSummary = () => {
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
      job['input']['recordTimeMs'] = moment(job['input']['recordTimeMs']).format('MM/DD/YY-HH:mm:ss')
    })

    const csv = json2csvParser.parse(dateFormattedJobs);
    var fileName = this.props.site + '-' + this.props.series + '-' + this.props.index +'.csv';
    this.downloadCsv(csv, fileName);
  }

  individualJobSummary = () => {
    var fields = _.cloneDeep(this.state.showFields[this.props.index])

    if(this.props.index === 'aci') {
      var overTimeL = fields['aciOverTimeL']['show']
      var overTimeR = fields['aciOverTimeR']['show']
      var flValsL = fields['aciFlValsL']['show']
      var flValsR = fields['aciFlValsR']['show']
    }
    if(this.props.index === 'adi') {
      var bandL = fields['bandL']['show']
      var bandR = fields['bandR']['show']
      var bandRangeL = fields['bandRangeL']['show']
      var bandRangeR = fields['bandRangeR']['show']
    }

    Object.keys(fields).forEach(fieldName => {
      if(fields[fieldName]['show'] === false){
        delete fields[fieldName]
      }
      else {
        delete fields[fieldName]['show']
        if(fields[fieldName]['type'] !== undefined)
          delete fields[fieldName]['type']
        if(fields[fieldName]['disabled'] !== undefined)
          delete fields[fieldName]['disabled']
      }
    })

    if(this.props.index === 'aci') {
      this.state.sortedJobs.forEach((job) => {
        var unwind = []
        if(flValsL) unwind.push('result.aciFlValsL')
        if(flValsR) unwind.push('result.aciFlValsR')
        if(overTimeL) unwind.push('result.aciOverTimeL')
        if(overTimeR) unwind.push('result.aciOverTimeR')

        this.parseJSON(fields, unwind, job)
      })
    }
    else if(this.props.index === 'adi'){
      var unwind = []
      if(bandL) unwind.push('result.bandL')
      if(bandR) unwind.push('result.bandR')
      if(bandRangeL) unwind.push('result.bandRangeL')
      if(bandRangeR) unwind.push('result.bandRangeR')

      this.state.sortedJobs.forEach(job => {this.parseJSON(fields, unwind, job)})
    }
    else {
      this.state.sortedJobs.forEach(job => {this.parseJSON(fields, [], job)})
    }
  }

  parseJSON = (fields, unwind, job) => {
    job['input']['recordTimeMs'] = moment(job['input']['recordTimeMs']).format('MM/DD/YY-HH:mm:ss')
    var fileName = this.props.site + '-' + this.props.series + '-' + job.input.name + '-' + this.props.index +'.csv'
    fields = Object.values(fields)

    const json2csvParser = new Parser({fields: fields, unwind: unwind});
    const csv = json2csvParser.parse(job);

    this.downloadCsv(csv, fileName)
  }

  downloadCsv = (csv, fileName) => {
    var hiddenElement = document.createElement('a')
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv)
    hiddenElement.download = fileName
    hiddenElement.click()
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.separateCsvs}
                  onChange={this.handleChange('separateCsvs')}
                  value="separateCsvs"
                  color="primary"
                />
              }
              label="Export jobs to separate CSV files"
            />
            <Button
              onClick={this.state.separateCsvs ? this.individualJobSummary : this.jobSetSummary}
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
