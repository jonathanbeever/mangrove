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

const styles = theme => ({
  root: {
    width: '70%',
    margin: '0 auto'
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

function getSteps() {
  return ['Choose Audio Files', 'Select R Index', 'Set Parameters'];
}

function getStepContent(step, props) {
  switch (step) {
    case 0:
      return <ChooseFiles />;
    case 1:
      return <ChooseIndex index={props.index} changeIndex={props.changeIndex} />;
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

class HorizontalLinearStepper extends React.Component {
  state = {
    activeStep: 0,
    disabledSubmit: false
  };

  componentDidUpdate = (prevProps) => {
    console.log(this.props)

    if(prevProps.submitDisabled !== this.props.submitDisabled) {
      if(this.state.activeStep === getSteps().length - 1)
        this.setState({ disabledSubmit: this.props.submitDisabled })
    }
    if(prevProps.selectedSpec !== this.props.selectedSpec) {
      if(this.props.selectedSpec.length)
        this.setState({ disabledSubmit: false })
      else
        this.setState({ disabledSubmit: true })
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
    });
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep}>
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
            <div>
              <Typography className={classes.instructions}>
                Jobs Started
              </Typography>
              <Button onClick={this.handleReset} className={classes.button}>
                Create More Jobs
              </Button>
            </div>
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