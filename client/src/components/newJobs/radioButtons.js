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
    width: '50%',
    fontSize: '20px'
  },
  formControl: {
    margin: theme.spacing.unit * 3,
    fontSize: '20px'
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
    fontSize: '20px'
  },
  label: {
    fontSize: '20px'
  }
});

class RadioButtonsGroup extends React.Component {
  state = {
    value: this.props.index,
  };

  componentDidUpdate = (prevProps) => {
    if(prevProps.index !== this.props.index)
      this.setState({ value: this.props.index })
  }

  handleChange = event => {
    this.props.changeIndex(event.target.value)
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend" style={{fontSize: '20px'}}>Index</FormLabel>
          <RadioGroup
            aria-label={<h5>Index</h5>}
            name="index"
            className={classes.group}
            value={this.state.value}
            onChange={this.handleChange}
          >
            <FormControlLabel value="aci" control={<Radio color="primary" />} label={<h5>ACI</h5>} />
            <FormControlLabel value="ndsi" control={<Radio color="primary"/>} label={<h5>NDSI</h5>} />
            <FormControlLabel value="aei" control={<Radio color="primary" />} label={<h5>AEI</h5>} />
            <FormControlLabel value="adi" control={<Radio color="primary" />} label={<h5>ADI</h5>} />
            <FormControlLabel value="bi" control={<Radio color="primary" />} label={<h5>BIO</h5>} />
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