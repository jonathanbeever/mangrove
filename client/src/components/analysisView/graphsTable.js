import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import GraphExpansionPanel from './graphExpansionPanel';
import NDSIChannelBarChart from '../infographs/NDSIChannelBarChart';
import NDSIValuesBarChart from '../infographs/NDSIValuesBarChart';
import NDSIValuesLineChart from '../infographs/NDSIValuesLineChart';
import NDSIChannelCompareBarChart from '../infographs/NDSIChannelCompareBarChart';
import NDSIValuesCompareBarChart from '../infographs/NDSIValuesCompareBarChart';
import ACILineChart from '../infographs/ACILineChart';
import ACIDualLineChart from '../infographs/ACIDualLineChart';
import ADIAEILineChart from '../infographs/ADIAEILineChart';
import ADIAEICompareLineChart from '../infographs/ADIAEICompareLineChart';
import BAAreaChart from '../infographs/BAAreaChart';
import BALineChart from '../infographs/BALineChart';
import BADualLineChart from '../infographs/BADualLineChart';
import BACompareAreaChart from '../infographs/BACompareAreaChart';
import ACIBarChart from '../infographs/ACIBarChart';
import ACICompareBarChart from '../infographs/ACICompareBarChart';
import RMSBarChart from '../infographs/RMSBarChart';
import RMSCompareBarChart from '../infographs/RMSCompareBarChart';

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
    let { graphs, index } = this.props;
    const rows = [];
    let ctr = 1;
    for (var key in graphs) {
      // skip loop if the property is from prototype
      if (!graphs.hasOwnProperty(key)) continue;

      var obj = graphs[key];
      switch(index)
      {
        case "rms":
          rows.push(
            <GraphExpansionPanel
              key={'graph'+ctr}
              title={obj.title}
              graph={<RMSBarChart
                results={obj}
              />}
            />
          )
          break;
        case "rms-compare":
          rows.push(
            <GraphExpansionPanel
              key={'graph'+ctr}
              title={obj.title}
              graph={<RMSCompareBarChart
                results={obj}
              />}
            />
          )
          break;
        case "aci":
          if(obj.title === "ACI Total Value Divided By Minutes")
          {
            rows.push(
              <GraphExpansionPanel
                key={'graph'+ctr}
                title={obj.title}
                graph={<ACIBarChart
                  results={obj.data}
                />}
              />
            )
          }else
          {
            if(obj.title === "ACI By Seconds Per File")
            {
              rows.push(
                <GraphExpansionPanel
                  key={'graph'+ctr}
                  title={obj.title}
                  graph={<ACILineChart
                    callback={this.props.callback}
                    results={obj.data}
                    custom={true}
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
                  graph={<ACILineChart
                    callback={this.props.callback}
                    results={obj.data}
                    custom={false}
                    xAxisLabel={obj.xAxisLabel}
                    yAxisLabel={obj.yAxisLabel}
                    dataKey1={obj.dataKey1}
                    dataKey2={obj.dataKey2}
                  />}
                />
              )
            }
          }
          break;
        case "aci-compare":
          if(obj.title === "Compared By File")
          {
            rows.push(
              <GraphExpansionPanel
                key={'graph'+ctr}
                title={obj.title}
                graph={<ACICompareBarChart
                  results={obj.data}
                />}
              />
            )
          }else{
            rows.push(
              <GraphExpansionPanel
                key={'graph'+ctr}
                title={obj.title}
                graph={<ACIDualLineChart
                  callback={this.props.callback}
                  results={obj.data}
                  xAxisLabel={obj.xAxisLabel}
                  yAxisLabel={obj.yAxisLabel}
                  dataKey1={obj.dataKey1}
                  dataKey2={obj.dataKey2}
                  dataKey3={obj.dataKey3}
                  dataKey4={obj.dataKey4}
                />}
              />
            )
          }
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
                    callback={this.props.callback}
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
                    callback={this.props.callback}
                    results={obj.data}
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
                    callback={this.props.callback}
                    results={obj.data}
                    xAxisLabel={"Date"}
                  />}
                />
              )
              break;
            default:
              break;
          }
          break;
        case "ndsi-compare":
          switch(obj.title)
          {
            case "Compared By Channels":
              rows.push(
                <GraphExpansionPanel
                  key={'graph'+ctr}
                  title={obj.title}
                  graph={<NDSIChannelCompareBarChart
                    callback={this.props.callback}
                    results={obj.data}
                  />}
                />
              )
              break;
            case "Compared By Values":
              rows.push(
                <GraphExpansionPanel
                  key={'graph'+ctr}
                  title={obj.title}
                  graph={<NDSIValuesCompareBarChart
                    callback={this.props.callback}
                    results={obj.data}
                  />}
                />
              )
              break;
            default:
              break;
          }
          break;
        case "adi":
          if(obj.title === "ADI By Band Range")
          {
            rows.push(
              <GraphExpansionPanel
                key={'graph'+ctr}
                title={obj.title}
                graph={<ADIAEILineChart
                  callback={this.props.callback}
                  reference={true}
                  results={obj.data}
                  xAxisLabel={obj.xAxisLabel}
                  yAxisLabel={obj.yAxisLabel}
                  dataKey1={obj.dataKey1}
                  dataKey2={obj.dataKey2}
                  refL={obj.refL}
                  refR={obj.refR}
                  refLabel1={obj.refLabel1}
                  refLabel2={obj.refLabel2}
                />}
              />
            )
          }else
          {
            rows.push(
              <GraphExpansionPanel
                key={'graph'+ctr}
                title={obj.title}
                graph={<ADIAEILineChart
                  callback={this.props.callback}
                  reference={false}
                  results={obj.data}
                  xAxisLabel={obj.xAxisLabel}
                  yAxisLabel={obj.yAxisLabel}
                  dataKey1={obj.dataKey1}
                  dataKey2={obj.dataKey2}
                  refL={obj.refL}
                  refR={obj.refR}
                  refLabel1={obj.refLabel1}
                  refLabel2={obj.refLabel2}
                />}
              />
            )
          }
          break;
        case "adi-compare":
          if(obj.title === "Compared By Band Values")
          {
            rows.push(
              <GraphExpansionPanel
                key={'graph'+ctr}
                title={obj.title}
                graph={<ADIAEICompareLineChart
                  callback={this.props.callback}
                  reference={true}
                  results={obj.data}
                  xAxisLabel={obj.xAxisLabel}
                  yAxisLabel={obj.yAxisLabel}
                  dataKey1={obj.dataKey1}
                  dataKey2={obj.dataKey2}
                  dataKey3={obj.dataKey3}
                  dataKey4={obj.dataKey4}
                  refL={obj.refL}
                  refR={obj.refR}
                  refLC={obj.refLC}
                  refRC={obj.refRC}
                  refLabel1={obj.refLabel1}
                  refLabel2={obj.refLabel2}
                  refLabel3={obj.refLabel3}
                  refLabel4={obj.refLabel4}
                />}
              />
            )
          }else
          {
            rows.push(
              <GraphExpansionPanel
                key={'graph'+ctr}
                title={obj.title}
                graph={<ADIAEICompareLineChart
                  callback={this.props.callback}
                  reference={false}
                  results={obj.data}
                  xAxisLabel={obj.xAxisLabel}
                  yAxisLabel={obj.yAxisLabel}
                  dataKey1={obj.dataKey1}
                  dataKey2={obj.dataKey2}
                  dataKey3={obj.dataKey3}
                  dataKey4={obj.dataKey4}
                  refL={obj.refL}
                  refR={obj.refR}
                  refLC={obj.refLC}
                  refRC={obj.refRC}
                  refLabel1={obj.refLabel1}
                  refLabel2={obj.refLabel2}
                  refLabel3={obj.refLabel3}
                  refLabel4={obj.refLabel4}
                />}
              />
            )
          }
          break;
        case "aei":
          if(obj.title === "AEI By Band Range")
          {
            rows.push(
              <GraphExpansionPanel
                key={'graph'+ctr}
                title={obj.title}
                graph={<ADIAEILineChart
                  callback={this.props.callback}
                  reference={true}
                  results={obj.data}
                  xAxisLabel={obj.xAxisLabel}
                  yAxisLabel={obj.yAxisLabel}
                  dataKey1={obj.dataKey1}
                  dataKey2={obj.dataKey2}
                  refL={obj.refL}
                  refR={obj.refR}
                  refLabel1={obj.refLabel1}
                  refLabel2={obj.refLabel2}
                />}
              />
            )
          }else
          {
            rows.push(
              <GraphExpansionPanel
                key={'graph'+ctr}
                title={obj.title}
                graph={<ADIAEILineChart
                  callback={this.props.callback}
                  reference={false}
                  results={obj.data}
                  xAxisLabel={obj.xAxisLabel}
                  yAxisLabel={obj.yAxisLabel}
                  dataKey1={obj.dataKey1}
                  dataKey2={obj.dataKey2}
                  refL={obj.refL}
                  refR={obj.refR}
                  refLabel1={obj.refLabel1}
                  refLabel2={obj.refLabel2}
                />}
              />
            )
          }
          break;
        case "aei-compare":
          if(obj.title === "Compared By Band Values")
          {
            rows.push(
              <GraphExpansionPanel
                key={'graph'+ctr}
                title={obj.title}
                graph={<ADIAEICompareLineChart
                  callback={this.props.callback}
                  reference={true}
                  results={obj.data}
                  xAxisLabel={obj.xAxisLabel}
                  yAxisLabel={obj.yAxisLabel}
                  dataKey1={obj.dataKey1}
                  dataKey2={obj.dataKey2}
                  dataKey3={obj.dataKey3}
                  dataKey4={obj.dataKey4}
                  refL={obj.refL}
                  refR={obj.refR}
                  refLC={obj.refLC}
                  refRC={obj.refRC}
                  refLabel1={obj.refLabel1}
                  refLabel2={obj.refLabel2}
                  refLabel3={obj.refLabel3}
                  refLabel4={obj.refLabel4}
                />}
              />
            )
          }else
          {
            rows.push(
              <GraphExpansionPanel
                key={'graph'+ctr}
                title={obj.title}
                graph={<ADIAEICompareLineChart
                  callback={this.props.callback}
                  reference={false}
                  results={obj.data}
                  xAxisLabel={obj.xAxisLabel}
                  yAxisLabel={obj.yAxisLabel}
                  dataKey1={obj.dataKey1}
                  dataKey2={obj.dataKey2}
                  dataKey3={obj.dataKey3}
                  dataKey4={obj.dataKey4}
                  refL={obj.refL}
                  refR={obj.refR}
                  refLC={obj.refLC}
                  refRC={obj.refRC}
                  refLabel1={obj.refLabel1}
                  refLabel2={obj.refLabel2}
                  refLabel3={obj.refLabel3}
                  refLabel4={obj.refLabel4}
                />}
              />
            )
          }
          break;
        case "bi":
          if(obj.title === "Bioacoustic Spectrum Values")
          {
            rows.push(
              <GraphExpansionPanel
                key={'graph'+ctr}
                title={obj.title}
                graph={<BAAreaChart
                  callback={this.props.callback}
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
                  callback={this.props.callback}
                  results={obj.data}
                  xAxisLabel={obj.xAxisLabel}
                  yAxisLabel={obj.yAxisLabel}
                />}
              />
            )
          }
          break;
        case "bi-compare":
          if(obj.title === "Compared By Spectrum Values")
          {
            rows.push(
              <GraphExpansionPanel
                key={'graph'+ctr}
                title={obj.title}
                graph={<BACompareAreaChart
                  callback={this.props.callback}
                  results={obj.data}
                  xAxisLabel={obj.xAxisLabel}
                  yAxisLabel={obj.yAxisLabel}
                  dataKey1={obj.dataKey1}
                  dataKey2={obj.dataKey2}
                  dataKey3={obj.dataKey3}
                  dataKey4={obj.dataKey4}
                />}
              />
            )
          }else{
            rows.push(
              <GraphExpansionPanel
                key={'graph'+ctr}
                title={obj.title}
                graph={<BADualLineChart
                  callback={this.props.callback}
                  results={obj.data}
                  xAxisLabel={obj.xAxisLabel}
                  yAxisLabel={obj.yAxisLabel}
                />}
              />
            )
          }
          break;
        default:
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
