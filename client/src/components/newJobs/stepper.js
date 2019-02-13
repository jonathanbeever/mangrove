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
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import axios from 'axios';

const styles = theme => ({
  root: {
    width: '70%',
    margin: '0 auto',
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  stepper: {
    backgroundColor: '#fff'
  },
  label: {
    fontSize: '26px'
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
        test: ''
      }
    },
    selectedSpec: [],
    submitDisabled: false,
    selectedFiles: [],
  };

  changeIndex = (value) => {
    // Clear specParamsByIndex for current index
    this.setState({ index: value })
  }

  handleSpecChange = name => e => {
    var tempState = this.state.specParams

    if(name !== 'shannon') {
      if(e.target.value === '')
        tempState[this.state.index][name] = ''
      else
        tempState[this.state.index][name] = parseInt(e.target.value)

    }
    else 
      tempState[this.state.index][name] = e.target.checked

    var submitDisabled = false
    // update for shannon adi index
    Object.keys(tempState[this.state.index]).forEach(param => {
      if(tempState[this.state.index][param] === '') {
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

  submitJob = () => {

    var inputs = this.state.selectedFiles

    // Spec already exists
    if(this.state.selectedSpec.length) {
      this.state.selectedSpec.forEach(spec => {

        inputs.forEach(inputId => {
          // Request to queue new job
          axios.put(
            "http://localhost:3000/jobs",  
            {
              type: this.state.index,
              inputId: inputId,
              specId: spec
            },
            {headers: {"Content-Type": "application/json"}}
          )
          .then(res => {
            console.log(res)
            // if(res.status === 201) {
            //   this.setState({message: 'Jobs Started. View progress in the job queue.'})
            //   this.setState({open: true})
            // }
            // else if(res.status === 200) {
            //   this.setState({message: 'This jobs has already been started. View progress in the job queue.'})
            //   this.setState({open: true})
            // }
          })
          .catch(err => console.log(err.message));
        })
      })
    }
    else {
      // Create spec
      var body = this.state.specParams[this.state.index]
      body.type = this.state.index

      axios.put(
        "http://localhost:3000/specs",  
        body,
        {headers: {"Content-Type": "application/json"}}
      )
      .then(res => {
        var specId = ''
          // If new spec was create set id
        if(res.status === 201) 
          specId = res.data.specId
        // Spec already exists, save id
        else if(res.status === 200) 
          specId = res.data.specId
        // Loop through inputs and make requests
        inputs.forEach(inputId => {
          // Request to queue new job
          axios.put(
            "http://localhost:3000/jobs",  
            {
              type: this.state.index,
              inputId: inputId,
              specId: specId
            },
            {headers: {"Content-Type": "application/json"}}
          )
          .then(res => {
            if(res.status === 201) {
              this.setState({message: 'Jobs Started. View progress in the job queue.'})
              this.setState({open: true})
            }
            else if(res.status === 200) {
              this.setState({message: 'This jobs has already been started. View progress in the job queue.'})
              this.setState({open: true})
            }
          })
          .catch(err => console.log(err.message));
        })
      })
    }
  }

  updateSelectedFiles = (selected) => {
    console.log(selected.length)
    if(selected.length)
      this.setState({ disabledSubmit: false })
    else
      this.setState({ disabledSubmit: true })

    this.setState({ selectedFiles: selected })
  }

  openDialog = (message) => {
    console.log(message)
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
      this.setState({
        activeStep: activeStep + 1
      });
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
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Stepper className={classes.stepper} activeStep={activeStep}>
          {steps.map((label, index) => {
            const props = {};
            const labelProps = {};
            return (
              <Step key={label} className={classes.label} {...props}>
                <StepLabel style={{fontSize: '16px'}}{...labelProps}><div style={{fontSize: '16px'}}>{label}</div></StepLabel>
              </Step>
            );
          })}
        </Stepper>
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
              <DialogContentText id="alert-dialog-slide-description">
                {this.state.message}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {activeStep === steps.length - 1 ?
                <div>
                  <Button onClick={this.handleReset} color="primary">
                    Start More Jobs
                  </Button>
                  <Button onClick={this.handleClose} color="primary">
                    Close
                  </Button>
                </div>
                :
                <Button onClick={this.handleClose} color="primary">
                  Close
                </Button>
              }
              
            </DialogActions>
          </Dialog>
          <div>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={this.handleBack}
                style={{fontSize: '12px'}}
                className={classes.button}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{fontSize: '12px'}}
                disabled={this.state.disabledSubmit}
                onClick={this.handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
              {getStepContent(activeStep, this)}
            </div>
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