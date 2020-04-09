import React, { Component } from 'react';
import {LineChart, Line, Label, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ContextMenu from '../infographs/components/ContextMenu';
import CustomDot from './components/customDots/CustomDot';
import CustomActiveDotADILeft from './components/customDots/ADI/CustomActiveDotADILeft';
import CustomActiveDotADIRight from './components/customDots/ADI/CustomActiveDotADIRight';
import CustomActiveDotADIByBandLeft from './components/customDots/ADI/CustomActiveDotADIAveByBandLeft';
import CustomActiveDotADIByBandRight from './components/customDots/ADI/CustomActiveDotADIAveByBandRight';
import CustomActiveDotAEILeft from './components/customDots/AEI/CustomActiveDotAEILeft';
import CustomActiveDotAEIRight from './components/customDots/AEI/CustomActiveDotAEIRight';
import CustomActiveDotAEIByBandLeft from './components/customDots/AEI/CustomActiveDotAEIByBandLeft';
import CustomActiveDotAEIByBandRight from './components/customDots/AEI/CustomActiveDotAEIByBandRight';
import AnnotationList from '../analysisView/annotationList';


class ADIAEILineChart extends Component {

  formatYAxis = (tickItem) => {
    let asF = parseFloat(tickItem);
    return (asF).toFixed(2);
  }

  getActiveDots = () => {
    let activeDots;
    let { title, index } = this.props;

    switch (this.props.title) {
      case 'ADI Value By Band Range':
        activeDots = {
          left: (<CustomActiveDotADIByBandLeft graph={title} type={index} />),
          right: (<CustomActiveDotADIByBandRight graph={title} type={index} />)
        }
        break;

      case 'ADI Average By Date And Hour':
      case 'ADI Average By File':
        activeDots = {
          left: <CustomActiveDotADILeft graph={title} type={index} />,
          right: <CustomActiveDotADIRight graph={title} type={index} />
        }
        break;

      case 'AEI By Band Range':
        activeDots = {
          left: <CustomActiveDotAEIByBandLeft graph={title} type={index} />,
          right: <CustomActiveDotAEIByBandRight graph={title} type={index} />
        }
        break;
      default:
        activeDots = {
          left: <CustomActiveDotAEILeft graph={title} type={index} />,
          right: <CustomActiveDotAEIRight graph={title} type={index} />
        }
    }

    return activeDots;
  }

  render(){

    let { results, xAxisLabel, yAxisLabel, dataKey1, dataKey2, vals, index, title, annotations } = this.props;
    let activeDots = this.getActiveDots();

    return(
      <div>
        <ContextMenu
          audioCallback={this.props.audioCallback}
          initializeAnnotationViewData={this.props.initializeAnnotationViewData}
        />
        <h6>{index.toUpperCase()} Left: {parseFloat(vals[0]).toFixed(2)}</h6>
        <h6>{index.toUpperCase()} Right: {parseFloat(vals[1]).toFixed(2)}</h6>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={0}>
              <h5>Right click a data point to add an annotation to the graph. </h5>
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <Paper elevation={0}>
              <LineChart width={750} height={600} data={results}
                margin={{top: 10, right: 30, left: 0, bottom: 0}}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="name">
                <Label value={xAxisLabel} position="insideBottom" offset={2} />
              </XAxis>
              <YAxis label={yAxisLabel} offset={0} tickFormatter={this.formatYAxis}/>
              <Tooltip/>
              <Legend />
              <Line 
                activeDot={activeDots.left}
                type="monotone" 
                dataKey={dataKey1} 
                stroke="#8884d8" 
                dot={<CustomDot annotations={annotations} graph={title} />}
                />
              <Line 
                activeDot={activeDots.right}
                type="monotone" 
                dataKey={dataKey2} 
                stroke="#82ca9d" 
                dot={<CustomDot annotations={annotations} graph={title} />}
                />
              </LineChart>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper style={{ height: 600, width: '100%', overflow: 'auto' }}>
              <AnnotationList
                annotations={this.props.annotations}
                graph={title}
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default ADIAEILineChart;
