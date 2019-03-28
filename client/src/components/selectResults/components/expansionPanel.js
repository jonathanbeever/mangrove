import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SpecsTable from '../specs/specsTable';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

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
    selected: this.props.selectedSpecs,
    checkedRms: false
  };

  handleClick = (event, value) => {
    if(!this.state.expanded)
      this.props.handleChange(this.props.index)
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if(this.props.index === 'rms') {
      if(!this.props.specs.length && prevProps.specs.length)
        this.setState({ checkedRms: false })
    }
    if(prevProps.expanded !== this.props.expanded)
      this.setState({ expanded: this.props.expanded })
    if(prevProps.selectedSpecs !== this.props.selectedSpecs) {
      this.setState({ selected: this.props.selectedSpecs })
    }
  }

  handleChange = name =>  e => {
    this.setState({ [name]: e.target.checked })
    let selected = e.target.checked ? [this.props.specs[0].specId] : []
    this.props.updateSelectedSpecs(selected, 'rms')
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <ExpansionPanel expanded={this.state.expanded} className={classes.panel}>
          {this.props.index === 'rms' ?
            <ExpansionPanelSummary>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={this.state.checkedRms}
                    disabled={!this.props.specs.length}
                    onChange={this.handleChange('checkedRms')}
                    value='checkedRms'
                    style={{color: '#b6cd26'}}
                  />
                }
                label={<div className={classes.heading}>RMS (No Parameters)</div>}
              />
              {this.state.checkedRms ?
                <Tooltip title="Delete">
                  <IconButton aria-label="Delete" onClick={() => {this.props.deleteSpecs([this.props.specs[0].specId])}}>
                    <DeleteIcon/>
                  </IconButton>
                </Tooltip>
                :
                ''
              }
            </ExpansionPanelSummary>
            :
            <ExpansionPanelSummary onClick={this.handleClick} expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>{this.props.index.toUpperCase() + ' Parameters'}</Typography>
            </ExpansionPanelSummary>
            }
            {this.props.index !== 'rms' ?
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
              :
              ''
            }
          </ExpansionPanel>
      </div>
    );
  }
}

Expansion.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Expansion);
