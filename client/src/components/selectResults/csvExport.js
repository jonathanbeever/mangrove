import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

const { Parser } = require('json2csv');

class ExportCsv extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
    }
  }

  componentDidMount = () => {
    console.log(this.props)
  }
  
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if(prevProps !== this.props) {
      console.log(this.props)
    }
  }

  convertJobsData = () => {
    switch(this.props.index) {
      case 'aci': {
        var fields = [
          {label:'FILENAME', value: 'input.name', stringify: true},
          {label:'SAMPLE_RATE', value: 'input.sampleRateHz', stringify: true},
          {label:'SIZE_BYTES', value: 'input.sizeBytes', stringify: true},
          {label:'DURATION', value: 'input.durationMs', stringify: true},
          {label:'RECORD_TIME', value: 'input.recordTimeMs', stringify: true},
          {label:'LAT', value: 'input.coords.lat', stringify: true},
          {label:'LONG', value: 'input.coords.long', stringify: true},
          {label:'INDEX', value: 'spec.type', stringify: true},
          {label:'MIN_FREQ', value: 'spec.minFreq', stringify: true},
          {label:'MAX_FREQ', value: 'spec.maxFreq', stringify: true},
          {label:'J', value: 'spec.j', stringify: true},
          {label:'FFT_W', value: 'spec.fftW', stringify: true},
          {label:'ACI_TOT_ALL_L', value: 'result.aciTotAllL', stringify: true},
          {label:'ACI_TOT_ALL_R', value: 'result.aciTotAllR', stringify: true},
          {label:'ACI_TOT_ALL_BY_MIN_L', value: 'result.aciTotAllByMinL', stringify: true},
          {label:'ACI_TOT_ALL_BY_MIN_R', value: 'result.aciTotAllByMinR', stringify: true}
        ]
        
        // const ops = { fields }
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(this.props.jobs);

        console.log(csv);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = this.props.site + '-' + this.props.series + '-' + this.props.index +'.csv';
        hiddenElement.click();
        break;
      }
      case 'ndsi': {
        var fields = [
          {label:'FILENAME', value: 'input.name', stringify: true},
          {label:'SAMPLE_RATE', value: 'input.sampleRateHz', stringify: true},
          {label:'SIZE_BYTES', value: 'input.sizeBytes', stringify: true},
          {label:'DURATION', value: 'input.durationMs', stringify: true},
          {label:'RECORD_TIME', value: 'input.recordTimeMs', stringify: true},
          {label:'LAT', value: 'input.coords.lat', stringify: true},
          {label:'LONG', value: 'input.coords.long', stringify: true},
          {label:'INDEX', value: 'spec.type', stringify: true},
          {label:'BIO_MIN', value: 'spec.bioMin', stringify: true},
          {label:'BIO_MAX', value: 'spec.bioMax', stringify: true},
          {label:'ANTHRO_MIN', value: 'spec.anthroMin', stringify: true},
          {label:'ANTHRO_MAX', value: 'spec.anthroMax', stringify: true},          
          {label:'FFT_W', value: 'spec.fftW', stringify: true},
          {label:'NDSI_L', value: 'result.ndsiL', stringify: true},
          {label:'NDSI_R', value: 'result.ndsiR', stringify: true},
          {label:'BIOPHONY_L', value: 'result.biophonyL', stringify: true},
          {label:'BIOPHONY_R', value: 'result.biophonyR', stringify: true},
          {label:'ANTHROPHONY_L', value: 'result.anthrophonyL', stringify: true},
          {label:'ANTHROPHONY_R', value: 'result.anthrophonyR', stringify: true}
        ]
        
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(this.props.jobs);

        console.log(csv);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = this.props.site + '-' + this.props.series + '-' + this.props.index +'.csv';
        hiddenElement.click();
        break;
      }
      case 'adi': {
        var fields = [
          {label:'FILENAME', value: 'input.name', stringify: true},
          {label:'SAMPLE_RATE', value: 'input.sampleRateHz', stringify: true},
          {label:'SIZE_BYTES', value: 'input.sizeBytes', stringify: true},
          {label:'DURATION', value: 'input.durationMs', stringify: true},
          {label:'RECORD_TIME', value: 'input.recordTimeMs', stringify: true},
          {label:'LAT', value: 'input.coords.lat', stringify: true},
          {label:'LONG', value: 'input.coords.long', stringify: true},
          {label:'INDEX', value: 'spec.type', stringify: true},
          {label:'MAX_FREQ', value: 'spec.maxFreq', stringify: true},
          {label:'DB_THRESHOLD', value: 'spec.dbThreshold', stringify: true},
          {label:'FREQ_STEP', value: 'spec.freqStep', stringify: true},
          {label:'SHANNON', value: 'spec.shannon', stringify: true},
          {label:'ADI_L', value: 'result.adiL', stringify: true},
          {label:'ADI_R', value: 'result.adiR', stringify: true},
          {label:'BAND_L', value: 'result.bandL', stringify: true},
          {label:'BAND_R', value: 'result.bandR', stringify: true}
        ]
        
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(this.props.jobs);

        console.log(csv);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = this.props.site + '-' + this.props.series + '-' + this.props.index +'.csv';
        hiddenElement.click();
        break;
      }
      case 'aei': {
       
        break;
      }
      case 'bi': {
       
        break;
      }
      case 'rms': {
        var fields = [
          {label:'FILENAME', value: 'input.name', stringify: true},
          {label:'SAMPLE_RATE', value: 'input.sampleRateHz', stringify: true},
          {label:'SIZE_BYTES', value: 'input.sizeBytes', stringify: true},
          {label:'DURATION', value: 'input.durationMs', stringify: true},
          {label:'RECORD_TIME', value: 'input.recordTimeMs', stringify: true},
          {label:'LAT', value: 'input.coords.lat', stringify: true},
          {label:'LONG', value: 'input.coords.long', stringify: true},
          {label:'INDEX', value: 'spec.type', stringify: true},
          {label:'RMS_L', value: 'result.rmsL', stringify: true},
          {label:'RMS_R', value: 'result.rmsR', stringify: true},
        ]
        
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(this.props.jobs);

        console.log(csv);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = this.props.site + '-' + this.props.series + '-' + this.props.index +'.csv';
        hiddenElement.click();
        break;
      }
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="row">
        <div className="col-4">
          {!this.state.ready ?
            <Button
              onClick={this.convertJobsData}
            >
              Convert to CSV
            </Button>
            :
            <a

            >
              <Button>Download CSV</Button>
            </a> 
          }
        </div>
      </div>
    );
  }
}

// ExportCsv.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default ExportCsv;
