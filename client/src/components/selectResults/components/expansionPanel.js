import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SpecsTable from '../specs/specsTable';


const styles = theme => ({
  root: {
    flexGrow: 1
  },
  heading: {
    fontSize: theme.typography.pxToRem(24),
    fontWeight: theme.typography.fontWeightRegular,
    backgroundColor: '#fafafa'
  },
  panel: {
    backgroundColor: '#fafafa',
  }
});

class Expansion extends React.Component {
  state = {
    expanded: this.props.expanded,
    selected: this.props.selectedSpecs
  };

  handleClick = (event, value) => {
    if(!this.state.expanded)
      this.props.handleChange(this.props.index)
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if(prevProps.expanded !== this.props.expanded)
      this.setState({ expanded: this.props.expanded })
    if(prevProps.selectedSpecs !== this.props.selectedSpecs) {
      this.setState({ selected: this.props.selectedSpecs })
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <ExpansionPanel expanded={this.state.expanded} className={classes.panel}>
          <ExpansionPanelSummary onClick={this.handleClick} expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>{this.props.index.toUpperCase() + ' Parameters'}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <SpecsTable
              index={this.props.index}
              specs={this.props.specs}
              params={this.props.params}
              updateSelectedSpecs={this.props.updateSelectedSpecs}
              selectedSpecs={this.state.selected}
              deleteSpecs={this.props.deleteSpecs}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

Expansion.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Expansion);
