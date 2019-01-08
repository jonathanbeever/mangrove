import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SpecsTable from './specsTable';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

function handleClick(e) {
  console.log(e)
}

function SimpleExpansionPanel(props) {
  const { classes } = props;

  return (
    <div className={classes.root} onClick={handleClick()}>
    {/* onChange={props.handleChange({'target': props.index})} */}
      <ExpansionPanel expanded={props.expanded}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>{props.index.toUpperCase() + ' Parameters'}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <SpecsTable 
            index={props.index}
            specs={props.specs}
            params={props.params}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

SimpleExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleExpansionPanel);