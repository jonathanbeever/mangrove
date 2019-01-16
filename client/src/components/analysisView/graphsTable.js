import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GraphExpansionPanel from './graphExpansionPanel';
import NDSICharts from '../infographs/NDSICharts';
import ACILineChart from '../infographs/ACILineChart';
import ADILineChart from '../infographs/ADILineChart';
import AEILineChart from '../infographs/AEILineChart';
import ADIAEICharts from '../infographs/ADIAEICharts';
import BAAreaChart from '../infographs/BAAreaChart';
import CompareACIData from '../infographs/CompareACIData';
import CompareBioData from '../infographs/CompareBioData';
import OutlierLineChart from '../infographs/OutlierLineChart';
import CompareNDSIData from '../infographs/CompareNDSIData';
import BALineChart from '../infographs/BALineChart';


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

    for (var key in this.props.graphs) {
      // skip loop if the property is from prototype
      if (!this.props.graphs.hasOwnProperty(key)) continue;

      var obj = this.props.graphs[key];
      for (var prop in obj) {
        // skip loop if the property is from prototype
        if(!obj.hasOwnProperty(prop)) continue;

        let xLabel = this.props.xAxisLabel;
        let yLabel = this.props.yAxisLabel;

        let firstDataKey = this.props.dataKey1;
        let secondDataKey = this.props.dataKey2;

        switch(this.props.index)
        {
          case "aci":
            const passedGraph = ({}) => (
              <ACILineChart
                results={obj}
                xAxisLabel="ACI Val"
                yAxisLabel="ACI Val"
              />
            )
            break;
          case "ndsi":
            passedGraph =
            break;
          case "adi":
            passedGraph =
            break;
          case "aei":
            passedGraph =
            break;
          case "bio":
            passedGraph =
            break;
        }

        rows.push(
          // <GraphExpansionPanel
          //   title={obj.title}
          //   graph={passedGraph}
          // />
        )
      }
    }

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
