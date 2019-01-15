import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GraphExpansionPanel from './graphExpansionPanel';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class GraphsTable extends React.Component {

  render()
  {
    let graphs = this.props.graphs;
    console.log(graphs)
    const rows = [];

    this.props.graphs.forEach((graph) => {
      rows.push(
        <GraphExpansionPanel
          title={graph.title}
          graph={graph}
        />
      );
    })

    return(
      {rows}
    )

    // <div className={classes.root}>
    //   <ExpansionPanel>
    //     <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
    //       <Typography className={classes.heading}>Expansion Panel 1</Typography>
    //     </ExpansionPanelSummary>
    //     <ExpansionPanelDetails>
    //       <Typography>
    //         Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
    //         sit amet blandit leo lobortis eget.
    //       </Typography>
    //     </ExpansionPanelDetails>
    //   </ExpansionPanel>
    //   <ExpansionPanel>
    //     <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
    //       <Typography className={classes.heading}>Expansion Panel 2</Typography>
    //     </ExpansionPanelSummary>
    //     <ExpansionPanelDetails>
    //       <Typography>
    //         Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
    //         sit amet blandit leo lobortis eget.
    //       </Typography>
    //     </ExpansionPanelDetails>
    //   </ExpansionPanel>
    //   <ExpansionPanel disabled>
    //     <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
    //       <Typography className={classes.heading}>Disabled Expansion Panel</Typography>
    //     </ExpansionPanelSummary>
    //   </ExpansionPanel>
    // </div>
  }
}

export default withStyles(styles)(GraphsTable);
