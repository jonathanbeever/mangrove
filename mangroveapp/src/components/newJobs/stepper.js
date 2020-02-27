import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import ChooseIndex from './chooseIndex';
import ChooseSpecs from './chooseSpecs';
import ChooseFiles from './chooseFiles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import axios from 'axios';
import LinearIntermediate from './linearIntermediate';
var _ = require('lodash');

const styles = theme => ({
  root: {
    width: '70%',
    margin: '0 auto',
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  buttonTop: {
    marginTop: theme.spacing.unit * 12,
    marginRight: 15+'px'
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  stepper: {
    backgroundColor: 'rgba(54, 25, 25, .00004)',
    marginTop: 80,
  },
  label: {
    fontSize: '26px',
  }
});

function getSteps() {
  return ['Choose Audio Files', 'Select R Index', 'Set Parameters'];
}

function getStepContent(step, $this) {
  switch (step) {
    case 0:
      return (
        <ChooseFiles
          selectedFiles={$this.state.selectedFiles}
          updateSelectedInputs={$this.updateSelectedFiles}
          openDialog={$this.openDialog}
          startRms={$this.startRms}
          promptConfirmDelete={$this.promptConfirmDelete}
          deletedFiles={$this.state.deletedFiles}
        />
      )
    case 1:
      return (
        <ChooseIndex
          index={$this.state.index}
          changeIndex={$this.changeIndex}
        />
      )
    case 2:
      return (
        <ChooseSpecs
          index={$this.state.index}
          specParams={$this.state.specParams}
          onSpecChange={$this.handleSpecChange}
          updateSelectedSpec={$this.updateSpecs}
          selectedSpec={$this.state.selectedSpec}
          useDefaultSpecs={$this.useDefaultSpecs}
          useDefaults={$this.state.useDefaults}
        />
      )
    default:
      return 'Unknown step';
  }
}

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class HorizontalLinearStepper extends React.Component {
  state = {
    activeStep: 0,
    disabledSubmit: true,
    open: false,
    index: 'aci',
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
      }
    },
    selectedSpec: [],
    selectedFiles: [],
    useDefaults: false
  };

  changeIndex = (value) => {
    // Clear specParams for prev index
    var params = Object.keys(this.state.specParams[this.state.index])
    var specs = this.state.specParams

    params.forEach(param => {
      if(param === 'shannon')
        specs[this.state.index][param] = false
      else
        specs[this.state.index][param] = ''
    })

    this.setState({ specParams: specs })

    this.setState({ index: value })
  }

  handleSpecChange = name => e => {
    var tempState = this.state.specParams

    if(name !== 'shannon') {
      if(e.target.checked || e.target.value === 'nyquist')
        tempState[this.state.index][name] = 'nyquist'
      else if(e.target.value !== '' && !isNaN(e.target.value))
        tempState[this.state.index][name] = parseInt(e.target.value)
      else
        tempState[this.state.index][name] = ''
    }
    else
      tempState[this.state.index][name] = e.target.checked

    var submitDisabled = false
    // update for shannon adi index
    Object.keys(tempState[this.state.index]).forEach(param => {
      if(tempState[this.state.index][param] === '' && param !== 'shannon') {
        submitDisabled = true
      }
    })

    this.setState({ disabledSubmit: submitDisabled })
    this.setState({ specParams: tempState })
  }

  updateSpecs = (selected) => {
    this.setState({ selectedSpec : selected })

    if(selected.length && this.state.selectedFiles.length)
      this.setState({ disabledSubmit: false})
    else
      this.setState({ disabledSubmit: true })
  }

  useDefaultSpecs = (e) => {
    if(!e.target.checked) {
      var params = this.state.specParams
      var keys = Object.keys(params[this.state.index])

      keys.forEach(key => {
        if(key === 'shannon')
          params[this.state.index][key] = false
        else
          params[this.state.index][key] = ''
      })

      this.setState({ specParams: params })
      this.setState({ disabledSubmit: true })
    }
    else
      this.setDefaultSpecs()
  }

  setDefaultSpecs = () => {
    var params = this.state.specParams

    switch(this.state.index) {
      case 'aci': {
        params['aci']['minFreq'] = 0
        params['aci']['maxFreq'] = 'nyquist'
        params['aci']['fftW'] = 512
        params['aci']['j'] = 5

        break;
      }
      case 'adi': {
        params['adi']['maxFreq'] = 10000
        params['adi']['dbThreshold'] = -50
        params['adi']['freqStep'] = 1000
        params['adi']['shannon'] = true

        break;
      }
      case 'aei': {
        params['aei']['maxFreq'] = 10000
        params['aei']['dbThreshold'] = -50
        params['aei']['freqStep'] = 1000

        break;
      }
      case 'bi': {
        params['bi']['minFreq'] = 2000
        params['bi']['maxFreq'] = 8000
        params['bi']['fftW'] = 512

        break;
      }
      case 'ndsi': {
        params['ndsi']['fftW'] = 1024
        params['ndsi']['anthroMin'] = 1000
        params['ndsi']['anthroMax'] = 2000
        params['ndsi']['bioMin'] = 2000
        params['ndsi']['bioMax'] = 11000

        break;
      }
      case 'rms': {
        break;
      }
      default:

    }

    this.setState({ specParams: params })
    this.setState({ disabledSubmit: false })
  }

  startRms = () => {
    this.setState({
      index: 'rms'
    }, () => {
      this.submitJob()
      this.changeIndex('aci')
    });
  }

  submitJob = () => {
    var message = (
      <div><LinearIntermediate /></div>
    );

    this.setState({message: message})
    this.setState({open: true})

    var inputs = this.state.selectedFiles

    // use this clear() for dev purposes
    // localStorage.clear();

    // Spec already exists
    if(this.state.selectedSpec.length) {
      this.state.selectedSpec.forEach((spec, specIdx) => {

        inputs.forEach((inputId, inputIdx) => {
          // Request to queue new job
          axios.put(
            "http://127.0.0.1:34251/jobs",
            {
              input: inputId,
              spec: spec
            },
            {headers: {"Content-Type": "application/json"}}
          )
          .then(res => {
            if(res.status === 201) {
              if(specIdx === this.state.selectedSpec.length - 1 && inputIdx === inputs.length - 1) {
                this.setState({message: 'Jobs started. View progress in the job queue.'})
              }
              // saves the newly added job into the job queue persistent storage
              let storedQueueJobs = JSON.parse(localStorage.getItem("jobs"));
              if(!storedQueueJobs) storedQueueJobs = [];
              let newQueueJobs = storedQueueJobs.concat([res.data.jobId]);

              localStorage.setItem("jobs", JSON.stringify(newQueueJobs));
            }
            else if(res.status === 200) {
              this.setState({message: 'This job has already been started. View progress in the job queue.'})
            }
          })
          .catch(err => console.log(err.message));
        })
      })
    }
    else {
      // Create spec
      var body = _.cloneDeep(this.state.specParams[this.state.index])
      body.type = this.state.index

      axios.put(
        "http://127.0.0.1:34251/specs",
        body,
        {headers: {"Content-Type": "application/json"}}
      )
      .then(res => {
        var specId = res.data.specId
        // Loop through inputs and make requests
        inputs.forEach((inputId, inputIdx) => {
          // Request to queue new job
          axios.put(
            "http://127.0.0.1:34251/jobs",
            {
              input: inputId,
              spec: specId
            },
            {headers: {"Content-Type": "application/json"}}
          )
          .then(res => {
            if(res.status === 201) {
              if(inputIdx === inputs.length - 1) {
                this.setState({message: 'Jobs started. View progress in the job queue.'})
              }
              // saves the newly added job into the job queue persistent storage
              let storedQueueJobs = JSON.parse(localStorage.getItem("jobs"));
              if(!storedQueueJobs) storedQueueJobs = [];
              let newQueueJobs = storedQueueJobs.concat([res.data.jobId]);

              localStorage.setItem("jobs", JSON.stringify(newQueueJobs));
            }
            else if(res.status === 200) {
              this.setState({message: 'This job has already been started. View in the job queue or catalog.'})
            }
          })
          .catch(err => console.log(err.message));
        })
      })
    }
  }

  updateSelectedFiles = (selected) => {
    if(selected.length)
      this.setState({ disabledSubmit: false })
    else
      this.setState({ disabledSubmit: true })

    this.setState({ selectedFiles: selected })
  }

  openDialog = (message) => {
    this.setState({
      message: message,
      open: true
    })
  }

  closeDialog = () => {
    this.setState({ open: false })
    this.setState({ selectedSpec: [] })
    this.setState({ selectedFiles: [] })
    this.setState({ disabledSubmit: false })
  }

  handleNext = () => {
    const { activeStep } = this.state;

    if(this.state.activeStep === getSteps().length - 2) {
      if(!this.state.selectedSpec.length) {
        var submitDisabled = false
        Object.keys(this.state.specParams[this.state.index]).forEach(param => {
          if(!this.state.specParams[this.state.index][param].length) {
            submitDisabled = true
          }
        })
        this.setState({ disabledSubmit: submitDisabled })
      }
      else {
        this.setState({ disabledSubmit: false })
      }
    }

    if(this.state.activeStep === getSteps().length - 1) {
      this.submitJob()
    }
    else {
      if(this.state.activeStep === 1 && this.state.index === 'rms') {
        this.startRms()
      }
      else {
        this.setState({
          activeStep: activeStep + 1
        });
      }
    }
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
      disabledSubmit: false
    }));
  };

  handleReset = () => {
    this.setState({ activeStep: 0 });
    this.closeDialog()
  };

  handleClose = () => {
    if(this.state.activeStep === 0)
      this.setState({ open: false });
    if(this.state.activeStep === 2)
      this.closeDialog()
    if(this.state.activeStep === 1) {
      this.setState({ open: false })
      this.setState({ selectedSpec: [] })
      this.setState({ disabledSubmit: false })
    }
    if(this.state.deletedFiles !== undefined && this.state.deletedFiles.length > 0)
      this.setState({ deletedFiles: [] })
  };

  promptConfirmDelete = (selected) => {
    this.setState({
      message: 'Are you sure you want to delete ' + selected.length + ' file(s) and corresponding jobs?',
      delete: true,
      open: true,
      selectedFiles: selected
    })
  }

  handleConfirmDelete = () => {
    let requests = [];

    this.state.selectedFiles.forEach(inputId => {
      requests.push(axios.delete('http://127.0.0.1:34251/inputs/'+inputId));
    });

    Promise.all(requests)
      .then(responses => {
        let deleted = 0
        let successDeleted = []
        
        responses.forEach(response => {
          if(response.status === 200) {
            successDeleted.push(response.data.message.substring(response.data.message.indexOf(': ') + 2, response.data.message.length - 1))
            deleted += response.data.jobs.length
          }
        })

        this.setState({
          message: successDeleted.length + ' files(s) and ' + deleted + ' corresponding job(s) deleted.',
          open: true,
          delete: false,
          selectedFiles: [],
          deletedFiles: successDeleted
        })
      });
  }

  render() {
    axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('id');
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <div className="row" style={{paddingBottom: 0}}>
          <div style={{width: 70+'%'}}>
            <Stepper position="static" className={classes.stepper} activeStep={activeStep}>
              {steps.map((label, index) => {
                const props = {};
                const labelProps = {};
                return (
                  <Step key={label} className={classes.label} {...props}>
                    <StepLabel style={{fontSize: 16}}{...labelProps}><div style={{fontSize: '16px'}}>{label}</div></StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </div>
          <div style={{width: 30+'%'}}>
            <div className={classes.buttonTop} style={{float:'right'}}>
              <Button
                disabled={activeStep === 0}
                onClick={this.handleBack}
                style={{backgroundColor:"#b6cd26", margin: 7}}
                className={classes.button}
              >
                Back
              </Button>
              <Button
                style={{backgroundColor:"#b6cd26", margin: 7, marginRight: 17}}
                disabled={this.state.disabledSubmit}
                onClick={this.handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ?
                  'Finish'
                  :
                  (activeStep === steps.length - 2 && this.state.index === 'rms' ?
                    'Finish'
                    :
                    'Next'
                  )
                }
              </Button>
            </div>
          </div>
        </div>
        <div>
          <Dialog
            open={this.state.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogContent>
              {this.state.message}
            </DialogContent>
            <DialogActions>
              {activeStep === steps.length - 1 ?
                <div>
                  <Button onClick={this.handleReset} style={{margin: 7}}>
                    <h6>Start More Jobs</h6>
                  </Button>
                  <Button onClick={this.handleClose} style={{margin: 7}}>
                    <h6>Close</h6>
                  </Button>
                </div>
                :
                (this.state.delete && this.state.open ?
                  <div>
                    <Button onClick={this.handleConfirmDelete} style={{margin: 7}}>
                      <h6>Yes</h6>
                    </Button>
                    <Button onClick={this.handleClose} style={{margin: 7}}>
                      <h6>No</h6>
                    </Button>
                  </div>
                  :
                  <Button onClick={this.handleClose} style={{margin: 7}}>
                    <h6>Close</h6>
                  </Button>
                )
              }
            </DialogActions>
          </Dialog>
          <div>
            {getStepContent(activeStep, this)}
            {/*<div style={{float: 'right'}}>
              <Button
                disabled={activeStep === 0}
                onClick={this.handleBack}
                style={{backgroundColor:"#b6cd26", margin: 7}}
                className={classes.button}
              >
                Back2
              </Button>
              <Button
                style={{backgroundColor:"#b6cd26", margin: 7, marginRight: 17}}
                disabled={this.state.disabledSubmit}
                onClick={this.handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ?
                  'Finish'
                  :
                  (activeStep === steps.length - 2 && this.state.index === 'rms' ?
                    'Finish'
                    :
                    'Next'
                  )
                }
              </Button>
            </div>*/}
              </div>
        </div>
      </div>
    );
  }
}

HorizontalLinearStepper.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(HorizontalLinearStepper);
