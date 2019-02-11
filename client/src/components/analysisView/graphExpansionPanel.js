import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = {
  root: {
    width: '110%',
  },
  heading: {
    fontSize: 24,
  },
}

class SimpleExpansionPanel extends Component {

  render(){

    let { key, title, graph } = this.props;

    return (
      <div className="root" key={key}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <p style={{fontSize: 16+'px'}}>{title}</p>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              {graph}
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default withStyles(styles)(SimpleExpansionPanel);
