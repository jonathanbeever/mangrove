import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    // margin: theme.spacing(1),
  },
});

function OutlinedChips(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Chip
        label={props.label}
        onDelete={()=>props.onDelete(props.label)}
        className={classes.chip}
        color="primary"
        variant="outlined"
      />
    </div>
  );
}

OutlinedChips.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OutlinedChips);
