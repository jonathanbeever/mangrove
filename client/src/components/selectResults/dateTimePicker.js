import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { normalize } from 'path';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 0,
    paddingTop: 20,
    paddingBottom: 0,
    fontWeight: 500
  }
});

function DateAndTimePickers(props) {
  const { classes } = props;

  return (
    // TODO: format to match other inputs
    <form noValidate>
      <TextField
        id="datetime-local"
        label="Date/Time of Recording"
        type="datetime-local"
        defaultValue=""
        className={classes.textField}
      />
    </form>
  );
}

DateAndTimePickers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DateAndTimePickers);