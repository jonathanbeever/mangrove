import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
// import { saveAs } from 'file-saver';
// import ReactDOM from 'react-dom';

const styles = {
  root: {
    width: '110%',
  },
  heading: {
    fontSize: 24,
  },
}

class SimpleExpansionPanel extends Component {
  state = {
    exported: false,
  };

  exportGraph = () =>  {
    // let chartSVG = ReactDOM.findDOMNode(this.props.graph).children[0];
    // let svgURL = new XMLSerializer().serializeToString(chartSVG);
    // let svgBlob = new Blob([svgURL], {type: "image/svg+xml;charset=utf-8"});
    // saveAs(svgBlob, this.state.uuid + ".svg");
    this.setState({ exported: true });
  }

  render(){

    let { key, title, graph } = this.props;
    let { exported } = this.state;

    return (
      <div className="root" key={key}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <p style={{fontSize: 16+'px'}}>{title}</p>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <Button
                variant="contained"
                color="primary"
                style={{ marginBottom:10+'px' }}
                onClick={this.exportGraph}
                >
                <p style={{ fontSize:14+'px', margin:4 }}>Export Data</p>
              </Button>
              {exported ?
                <p style={{ fontSize:12+'px' }}>Exported to data folder in program directory</p>
                :
                <p></p>
              }
            </div>
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
