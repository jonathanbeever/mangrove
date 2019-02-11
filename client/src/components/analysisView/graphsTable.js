import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import GraphExpansionPanel from './graphExpansionPanel';
import NDSIChannelBarChart from '../infographs/NDSIChannelBarChart';
import NDSIValuesBarChart from '../infographs/NDSIValuesBarChart';
import NDSIValuesLineChart from '../infographs/NDSIValuesLineChart';
import NDSIChannelCompareBarChart from '../infographs/NDSIChannelCompareBarChart';
import NDSIValuesCompareBarChart from '../infographs/NDSIValuesCompareBarChart';
import NDSIDualLineChart from '../infographs/NDSIDualLineChart';
import ACILineChart from '../infographs/ACILineChart';
import ACIDualLineChart from '../infographs/ACIDualLineChart';
import ADIAEILineChart from '../infographs/ADIAEILineChart';
import ADIAEICompareLineChart from '../infographs/ADIAEICompareLineChart';
import BAAreaChart from '../infographs/BAAreaChart';
import BALineChart from '../infographs/BALineChart';
import BADualLineChart from '../infographs/BADualLineChart';
import BACompareAreaChart from '../infographs/BACompareAreaChart';

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
        case "aci":
          rows.push(
            <GraphExpansionPanel
              key={'graph'+ctr}
              title={obj.title}
              data={obj.data}
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
        case "aci-compare":
          rows.push(
            <GraphExpansionPanel
              key={'graph'+ctr}
              title={obj.title}
              data={obj.data}
              graph={<ACIDualLineChart
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
          break;
        case "ndsi":
          switch(obj.title)
          {
            case "NDSI By Channel":
              rows.push(
                <GraphExpansionPanel
                  key={'graph'+ctr}
                  title={obj.title}
                  data={obj.data}
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
                  data={obj.data}
                  graph={<NDSIValuesBarChart
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
                  data={obj.data}
                  graph={<NDSIValuesLineChart
                    results={obj.data}
                    xAxisLabel={"Date"}
                  />}
                />
              )
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
                  data={obj.data}
                  graph={<NDSIChannelCompareBarChart
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
                  data={obj.data}
                  graph={<NDSIValuesCompareBarChart
                    results={obj.data}
                  />}
                />
              )
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
                data={obj.data}
                graph={<ADIAEILineChart
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
                data={obj.data}
                graph={<ADIAEILineChart
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
                data={obj.data}
                graph={<ADIAEICompareLineChart
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
                data={obj.data}
                graph={<ADIAEICompareLineChart
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
                data={obj.data}
                graph={<ADIAEILineChart
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
                data={obj.data}
                graph={<ADIAEILineChart
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
                data={obj.data}
                graph={<ADIAEICompareLineChart
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
                data={obj.data}
                graph={<ADIAEICompareLineChart
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
                data={obj.data}
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
                data={obj.data}
                graph={<BALineChart
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
                data={obj.data}
                graph={<BACompareAreaChart
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
                data={obj.data}
                graph={<BADualLineChart
                  results={obj.data}
                  xAxisLabel={obj.xAxisLabel}
                  yAxisLabel={obj.yAxisLabel}
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