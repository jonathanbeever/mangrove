import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit,
  },
});

function handleDelete(props) {
    console.log(props)
}

function handleClick() {
  alert('You clicked the Chip.'); // eslint-disable-line no-alert
}

function OutlinedChips(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Chip
        label={props.label}
        onDelete={()=>props.onDelete(props.label)}
        className={classes.chip}
        color="secondary"
        variant="outlined"
      />
    </div>
  );
}

OutlinedChips.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OutlinedChips);
