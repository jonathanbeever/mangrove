import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ChooseIndex from './chooseIndex';
import ChooseSpecs from './chooseSpecs';
import ChooseFiles from './chooseFiles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

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
    backgroundColor: '#fafafa'
  }
});

function getSteps() {
  return ['Choose Audio Files', 'Select R Index', 'Set Parameters'];
}

function getStepContent(step, props) {
  switch (step) {
    case 0:
      return (
        <ChooseFiles 
          selectedFiles={props.selectedFiles}
          updateSelectedInputs={props.updateSelectedFiles}
          allFiles={props.allFiles}
          newFiles={props.newFiles}
          handleInputUpload={props.handleInputUpload}
        />
      )
    case 1:
      return (
        <ChooseIndex 
          index={props.index} 
          changeIndex={props.changeIndex} 
        />
      )
    case 2:
      return (
        <ChooseSpecs 
          index={props.index} 
          specParams={props.specParams} 
          onSpecChange={props.onSpecChange} 
          updateSelectedSpec={props.updateSelectedSpec}
          selectedSpec={props.selectedSpec}
          specs={props.specs}
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
    open: this.props.dialog
  };

  componentDidUpdate = (prevProps) => {
    if(prevProps.selectedFiles !== this.props.selectedFiles) {
      if(this.state.activeStep === 0) {
        if(this.props.selectedFiles.length)
          this.setState({ disabledSubmit: false })
        else
          this.setState({ disabledSubmit: true })
      }
    }
    if(prevProps.selectedSpec !== this.props.selectedSpec) {
      if(this.state.activeStep === getSteps().length - 1) {
        if(this.props.selectedSpec.length)
          this.setState({ disabledSubmit: false })
        else
          this.setState({ disabledSubmit: true })
      }
    }
    if(prevProps.submitDisabled !== this.props.submitDisabled) {
      if(this.state.activeStep === getSteps().length - 1) {
        this.setState({ disabledSubmit: this.props.submitDisabled })        
      }
    }
  }

  handleNext = () => {
    const { activeStep } = this.state;

    if(this.state.activeStep === getSteps().length - 2) {
      this.setState({ disabledSubmit: true })
    }

    if(this.state.activeStep === getSteps().length - 1) {
      this.props.submitJob()
    }

    this.setState({
      activeStep: activeStep + 1
    });
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
      disabledSubmit: false
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
      disabledSubmit: false
    });
    this.props.closeDialog()
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.closeDialog()
    this.setState({ disabledSubmit: false })
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
              <Step key={label} {...props}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <Dialog
              open={this.props.dialog}
              TransitionComponent={Transition}
              keepMounted
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  {this.props.message}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleReset} color="primary">
                  Start More Jobs
                </Button>
                <Button onClick={this.handleClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          ) : (
            <div>
              <div>
              <Button
                  disabled={activeStep === 0}
                  onClick={this.handleBack}
                  className={classes.button}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={this.state.disabledSubmit}
                  onClick={this.handleNext}
                  className={classes.button}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
                {getStepContent(activeStep, this.props)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

HorizontalLinearStepper.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(HorizontalLinearStepper);