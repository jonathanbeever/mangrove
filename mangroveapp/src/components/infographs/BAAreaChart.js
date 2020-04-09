import React, {Component} from 'react';
import {AreaChart, Brush, Label, Legend, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ContextMenu from '../infographs/components/ContextMenu';
import CustomActiveDotBIAreaLeft from './components/customDots/BI/CustomActiveDotBIAreaLeft';
import CustomActiveDotBIAreaRight from './components/customDots/BI/CustomActiveDotBIAreaRight';
import CustomDot from './components/customDots/CustomDot';
import AnnotationList from '../analysisView/annotationList';

class BAAreaChart extends Component {

  formatYAxis = (tickItem) => {
    let asF = parseFloat(tickItem);
    return (asF).toFixed(2);
  }

  render(){
    let { results, xAxisLabel, yAxisLabel, dataKey1, dataKey2, annotations, title, index } = this.props;

    return(
      <div>
        <ContextMenu
          audioCallback={this.props.audioCallback}
          initializeAnnotationViewData={this.props.initializeAnnotationViewData}
        />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={0}>
              <h5>Right click a data point to add an annotation to the graph. </h5>
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <Paper elevation={0}>
              <AreaChart width={750} height={600} data={results} syncId="bi"
                margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name">
                  <Label value={xAxisLabel} position="insideBottom" offset={2} />
                </XAxis>
                <Legend />
                <YAxis domain={['dataMin', 'dataMax']}>
                  <Label value={yAxisLabel} position="insideLeft" offset={2}  tickFormatter={this.formatYAxis}/>
                </YAxis>
                <Tooltip/>
                <Area
                  activeDot={<CustomActiveDotBIAreaLeft graph={title} type={index} />}
                  type='monotone' 
                  dataKey={dataKey1} 
                  stackId="1" 
                  stroke='#8884d8' 
                  fill='#8884d8'
                  dot={<CustomDot annotations={annotations} graph={title} />} 
                />
                <Area
                  activeDot={<CustomActiveDotBIAreaRight graph={title} type={index} />}
                  type='monotone' 
                  dataKey={dataKey2} 
                  stackId="2" 
                  stroke='#82ca9d' 
                  fill='#82ca9d'
                  dot={<CustomDot annotations={annotations} graph={title} />} 
                />
                <Brush />
              </AreaChart>
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

export default BAAreaChart;
