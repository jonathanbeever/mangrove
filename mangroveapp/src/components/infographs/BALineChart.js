import React, { Component } from 'react';
import {LineChart, Line, Label, Legend, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ContextMenu from '../infographs/components/ContextMenu';
import CustomActiveDotBILeft from './components/customDots/BI/CustomActiveDotBILeft';
import CustomActiveDotBIRight from './components/customDots/BI/CustomActiveDotBIRight';
import CustomDot from './components/customDots/CustomDot';
import AnnotationList from '../analysisView/annotationList';

class BALineChart extends Component {

  formatYAxis = (tickItem) => {
    let asF = parseFloat(tickItem);
    return (asF).toFixed(2);
  }

  alertBrush = (indices) => {
    let start = indices.startIndex;
    let end = indices.endIndex;
    if(end - start > 1500){
      if(localStorage.getItem('analysisViewAlert') === true)
      {
        this.props.callback();
      }
    }
  }

  render(){

    let { results, xAxisLabel, yAxisLabel, annotations, title, index } = this.props;

    let endOfBrush;
    let len = results.length;
    if(len > 1500) endOfBrush = 1500;
    else endOfBrush = len;

    return(
      <div>
        <ContextMenu
          audioCallback={this.props.audioCallback}
          initializeAnnotationViewData={this.props.initializeAnnotationViewData}
          canAnnotate={true}
          canPlaySound={true}
        />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={0}>
              <h5>Right click a data point to add an annotation to the graph or listen to a sound file.</h5>
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <Paper elevation={0}>
              <LineChart width={750} height={600} data={results}
                margin={{top: 10, right: 30, left: 30, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name" height={45}>
                  <Label value={xAxisLabel} position="insideBottom" />
                </XAxis>
                <YAxis>
                  <Label value={yAxisLabel} position="insideLeft" offset={-30} tickFormatter={this.formatYAxis} />
                </YAxis>
                <Legend />
                <Tooltip/>
                <Line
                  activeDot={<CustomActiveDotBILeft graph={title} type={index} />}
                  type='monotone' 
                  dataKey='areaL' 
                  stroke='#8884d8' 
                  dot={<CustomDot annotations={annotations} graph={title} />} 
                />
                <Line
                  activeDot={<CustomActiveDotBIRight graph={title} type={index} />}
                  type='monotone' 
                  dataKey='areaR' 
                  stroke='#82ca9d' 
                  dot={<CustomDot annotations={annotations} graph={title} />} 
                />
                <Brush endIndex={endOfBrush - 1} onChange={this.alertBrush}>
                  <Line
                    activeDot={<CustomActiveDotBILeft graph={title} type={index} />}
                    type='monotone' 
                    dataKey='areaL' 
                    stroke='#8884d8' 
                    dot={<CustomDot annotations={annotations} graph={title} />} 
                  />
                  <Line
                    activeDot={<CustomActiveDotBIRight graph={title} type={index} />}
                    type='monotone' 
                    dataKey='areaR' 
                    stroke='#82ca9d' 
                    dot={<CustomDot annotations={annotations} graph={title} />} 
                  />
                </Brush>
              </LineChart>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper style={{ height: 600, width: '100%', overflow: 'auto' }}>
              <AnnotationList
                annotations={annotations}
                graph={title}
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}



export default BALineChart;
