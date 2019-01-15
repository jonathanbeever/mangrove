import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const styles = theme => ({
  root: {
    display: 'flex',
    width: '50%'
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class RadioButtonsGroup extends React.Component {
  state = {
    value: 'aci',
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
    this.props.changeIndex(event.target.value)
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Index</FormLabel>
          <RadioGroup
            aria-label="Index"
            name="index"
            className={classes.group}
            value={this.state.value}
            onChange={this.handleChange}
          >
            <FormControlLabel value="aci" control={<Radio />} label="ACI" />
            <FormControlLabel value="ndsi" control={<Radio />} label="NDSI" />
            <FormControlLabel value="aei" control={<Radio />} label="AEI" />
            <FormControlLabel value="adi" control={<Radio />} label="ADI" />
            <FormControlLabel value="bi" control={<Radio />} label="BIO" />
            <FormControlLabel value="rms" control={<Radio />} label="RMS" />
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}

RadioButtonsGroup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RadioButtonsGroup);