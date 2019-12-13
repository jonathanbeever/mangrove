import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing.unit * 2
  },
  textField: {
    width: '100%',
    fontWeight: 500,
    color: 'black',
  },
});

function TimePickers(props) {
  const { classes } = props;

  return (
    <form className={classes.container} noValidate>
      <p style={{fontSize:13+'px', fontWeight: 500, color: 'black', marginBottom: 0}}>Time</p>
      <TextField
        id="time"
        type="time"
        value={props.time}
        onChange={props.onChange('time', props.value)}
        className={classes.textField}
        inputProps={{
            // custom, user define
          step: 300, // 5 min
        }}
      />
    </form>
  );
}

TimePickers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TimePickers);