import React, { Component } from 'react';
import {LineChart, Line, Label, Legend, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ContextMenu from '../../infographs/components/ContextMenu';
import CustomActiveDotML from '../components/customDots/ML/CustomActiveDotML';
import CustomDot from '../components/customDots/CustomDot';
import AnnotationList from '../../analysisView/annotationList';
import SoundTypes from '../../../constants/analysis/soundTypes';

class MLLineChart extends Component {
  formatYAxis = (tickItem) => {
    let asF = parseFloat(tickItem);
    
    // Switch case should make future sounds easy to add to the Y Axis
    switch (asF) {
      case 0.0:
        return SoundTypes[0];
      case 1.0:
        return SoundTypes[1];
      default:
        return '';
    }
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
    let data = this.props.results;

    let xLabel = this.props.xAxisLabel;
    let yLabel = this.props.yAxisLabel;

    let dataKey = this.props.dataKey1;

    let title = this.props.title;
    let index = this.props.index;

    let endOfBrush;
    let len = data.length;
    if(len > 1500) endOfBrush = 1500;
    else endOfBrush = len;

    return(
      <div>
        <ContextMenu
          audioCallback={this.props.audioCallback}
          initializeAnnotationViewData={this.props.initializeAnnotationViewData}
        />
        <div>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={0}>
                <h5>To listen to a sound file, simply click on a datapoint dot, and an audio player will appear.</h5>
              </Paper>
            </Grid>
            <Grid item xs={9}>
              <Paper elevation={0}>
                <LineChart width={750} height={500} data={data}
                  margin={{top: 10, right: 30, left: 50, bottom: 0}}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" height={45}>
                    <Label value={xLabel} position="insideBottom" />
                  </XAxis>
                  <YAxis domain={[-0.5, 1.5]} tickFormatter={this.formatYAxis}>
                    <Label value={yLabel} position="insideLeft" offset={0} />
                  </YAxis>
                  <Tooltip />
                  <Legend />
                  <Line
                    activeDot={<CustomActiveDotML graph={title} type={index} />}
                    type='stepBefore' 
                    dataKey={dataKey} 
                    stroke='#8884d8' 
                    dot={<CustomDot annotations={this.props.annotations} graph={title} />} 
                  />
                  <Brush endIndex={endOfBrush - 1} onChange={this.alertBrush} />
                </LineChart>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper style={{ height: 500, width: '100%', overflow: 'auto' }}>
                <AnnotationList
                  annotations={this.props.annotations}
                  graph={title}
                />
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default MLLineChart;
