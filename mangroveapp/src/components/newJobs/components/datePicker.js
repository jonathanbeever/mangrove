import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing.unit * 2,
  },
  textField: {
    marginBottom: 0,

    width: '100%',
    fontWeight: 500,
    color: 'black'
  }
});

function DatePickers(props) {
  const { classes } = props;

  return (
    <form className={classes.container} noValidate>
      <p style={{fontSize:13+'px', fontWeight: 500, color: 'black', marginBottom: 0}}>Date</p>
      <TextField
        id="date"
        type="date"
        value={props.date}
        onChange={props.onChange('date', props.value)}
        className={classes.textField}
      />
    </form>
  );
}

DatePickers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DatePickers);