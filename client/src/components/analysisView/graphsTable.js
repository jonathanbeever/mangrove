import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GraphExpansionPanel from './graphExpansionPanel';
import NDSIChannelBarChart from '../infographs/NDSIChannelBarChart';
import NDSIChannelLineChart from '../infographs/NDSIChannelLineChart';
import NDSIValuesBarChart from '../infographs/NDSIValuesBarChart';
import NDSIValuesLineChart from '../infographs/NDSIValuesLineChart';
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
    fontSize: theme.typography.pxToRem(24),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class GraphsTable extends React.Component {

  render()
  {
    let graphs = this.props.graphs;
    const rows = [];

    for (var key in this.props.graphs) {
      // skip loop if the property is from prototype
      if (!this.props.graphs.hasOwnProperty(key)) continue;

      var obj = this.props.graphs[key];
      if(obj.title === "ACI By Date"){
        console.log(obj)
      }
      switch(this.props.index)
      {
        case "aci":
          rows.push(
            <GraphExpansionPanel
              title={obj.title}
              graph={<ACILineChart
                results={obj.data}
                xAxisLabel={obj.xAxisLabel}
                yAxisLabel={obj.yAxisLabel}
                dataKey1={obj.dataKey1}
                dataKey2={obj.dataKey2}
              />}
            />
          )
          break;
        case "ndsi":
          switch(obj.title)
          {
            case "NDSI By Channel":
              rows.push(
                <GraphExpansionPanel
                  title={obj.title}
                  graph={<NDSIChannelBarChart
                    results={obj.data}
                  />}
                />
              )
              break;
            case "NDSI Values":
              rows.push(
                <GraphExpansionPanel
                  title={obj.title}
                  graph={<NDSIValuesBarChart
                    results={obj.data}
                  />}
                />
              )
              break;
            case "NDSI By Hour":
              rows.push(
                <GraphExpansionPanel
                  title={obj.title}
                  graph={<NDSIValuesLineChart
                    results={obj.data}
                    xAxisLabel={"Hour of Day"}
                  />}
                />
              )
              break;
            case "NDSI By Date":
              rows.push(
                <GraphExpansionPanel
                  title={obj.title}
                  graph={<NDSIValuesLineChart
                    results={obj.data}
                    xAxisLabel={"Date"}
                  />}
                />
              )
              break;
          }

          break;
        case "adi":
          rows.push(
            <GraphExpansionPanel
              title={obj.title}
              graph={<ADILineChart
                results={obj.data}
                xAxisLabel={obj.xAxisLabel}
                dataKey1={obj.dataKey1}
                dataKey2={obj.dataKey2}
                refL={obj.refL}
                refR={obj.refR}
              />}
            />
          )
          break;
        case "aei":
          rows.push(
            <GraphExpansionPanel
              title={obj.title}
              graph={<AEILineChart
                results={obj.data}
                xAxisLabel={obj.xAxisLabel}
                dataKey1={obj.dataKey1}
                dataKey2={obj.dataKey2}
                refL={obj.refL}
                refR={obj.refR}
              />}
            />
          )
          break;
        case "bio":
          if(obj.title === "Bioacoustic Spectrum Values")
          {
            rows.push(
              <GraphExpansionPanel
                title={obj.title}
                graph={<BAAreaChart
                  results={obj.data}
                  xAxisLabel={obj.xAxisLabel}
                  yAxisLabel={obj.yAxisLabel}
                  dataKey1={obj.dataKey1}
                  dataKey2={obj.dataKey2}
                />}
              />
            )
          }else{
            rows.push(
              <GraphExpansionPanel
                title={obj.title}
                graph={<BALineChart
                  results={obj.data}
                  xAxisLabel={obj.xAxisLabel}
                  yAxisLabel={obj.yAxisLabel}
                  dataKey1={obj.dataKey1}
                  dataKey2={obj.dataKey2}
                />}
              />
            )
          }
          break;
      }
    }

    return(
      <Table>
        <TableBody>{rows}</TableBody>
      </Table>
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
