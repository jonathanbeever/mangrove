import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import GraphExpansionPanel from './graphExpansionPanel';
import NDSIChannelBarChart from '../infographs/NDSIChannelBarChart';
import NDSIValuesBarChart from '../infographs/NDSIValuesBarChart';
import NDSIValuesLineChart from '../infographs/NDSIValuesLineChart';
import ACILineChart from '../infographs/ACILineChart';
import ADILineChart from '../infographs/ADILineChart';
import AEILineChart from '../infographs/AEILineChart';
import BAAreaChart from '../infographs/BAAreaChart';
import BALineChart from '../infographs/BALineChart';


const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(2),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class GraphsTable extends React.Component {

  render()
  {
    // let graphs = this.props.graphs;
    const rows = [];
    let ctr = 1;
    for (var key in this.props.graphs) {
      // skip loop if the property is from prototype
      if (!this.props.graphs.hasOwnProperty(key)) continue;

      var obj = this.props.graphs[key];
      switch(this.props.index)
      {
        case "aci":
          rows.push(
            <GraphExpansionPanel
              key={'graph'+ctr}
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
                  key={'graph'+ctr}
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
                  key={'graph'+ctr}
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
                  key={'graph'+ctr}
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
                  key={'graph'+ctr}
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
              key={'graph'+ctr}
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
              key={'graph'+ctr}
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
                key={'graph'+ctr}
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
                key={'graph'+ctr}
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
      ctr++;
    }

    return(
      <div>
        {rows}
      </div>
    )

  }
}

export default withStyles(styles)(GraphsTable);
