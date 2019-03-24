import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import {LineChart, Line, Label, Legend, Brush, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

const styles = theme => ({
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class ACIDualLineChart extends Component {
  constructor() {
    super();

    this.state = {
      showGraph: false,
    };
  }

  componentDidMount = () => {
    let { results } = this.props;
    console.log(results);
    let fileNames = [...new Set(results.map(x => x.name))];
    console.log(fileNames);
    this.setState({ fileNames });
    this.setState({ chosenFile: fileNames[0] });
  }

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

  // Handler for the file Select
  handleFileChange = event => {
    this.setState({ chosenFile: event.target.value });
    this.setState({ [event.target.name]: event.target.value });
  }

  // Handler for the file-compare Select
  handleFileCompareChange = event => {
    this.setState({ chosenCompareFile: event.target.value });
    this.setState({ [event.target.name]: event.target.value });
  }

  // Creates the items seen in the file menu
  fileMenuItems = (fileNames) => {
    const menuItems = fileNames.map(file => {
      return <MenuItem key={file} value={file}>{file}</MenuItem>
    });
    return menuItems;
  }

  // Creates the items seen in the compare site menu
  fileMenuCompareItems = (fileNames) => {
    let { chosenFile } = this.state;

    const fileNamesWithoutChosen = fileNames.filter(file => file !== chosenFile);
    const menuItems = [<MenuItem value=""><em>None</em></MenuItem>].concat(fileNamesWithoutChosen.map(file => {
      return <MenuItem value={file}>{file}</MenuItem>
    }));

    return menuItems;
  }

  displayGraph = () => {
    let { chosenFile, chosenCompareFile } = this.state;
    let { results } = this.props;
    let chosenData = results.filter(x => x.input.name === chosenFile);
    let compareData = results.filter(x => x.input.name === chosenCompareFile);
    console.log(chosenData);
    console.log(compareData);
    this.setState({ showGraph: true });
  }

  render(){
    let { showGraph, dataToShow, chosenFile, chosenCompareFile, fileNames } = this.state;
    let { xAxisLabel, yAxisLabel, dataKey1, dataKey2, dataKey3, dataKey4 } = this.props;
    const { classes } = this.props;

    console.log(fileNames);
    console.log(chosenFile);
    console.log(chosenCompareFile);

    let endOfBrush;
    if(dataToShow){
      let len = dataToShow.length;
      if(len > 1500) endOfBrush = 1500;
      else endOfBrush = len;
    }

    return(
      <div>
        <Paper style={{ marginTop:10+'px' }}>
          <div className="row">
            <div className="col-8">
              <FormControl style={{ marginLeft:10+'px', marginBottom:10+'px' }}>
                <InputLabel shrink htmlFor="file-helper"><h4>First file</h4></InputLabel>
                <Select
                  value={chosenFile ? chosenFile : ''}
                  onChange={this.handleFileChange}
                  input={<Input name="file" id="file-helper" />}
                  displayEmpty
                  name="file"
                  className={classes.selectEmpty}
                >
                  {fileNames ?
                    this.fileMenuItems(fileNames)
                  :
                    ''}
                </Select>
                <FormHelperText style={{ fontSize:12+'px' }}>Select file to view</FormHelperText>
              </FormControl>
              <FormControl style={{ marginLeft:10+'px', marginBottom:10+'px' }}>
                <InputLabel shrink htmlFor="file-compare-helper"><h4>File to compare</h4></InputLabel>
                <Select
                  value={chosenCompareFile ? chosenCompareFile : ''}
                  onChange={this.handleFileCompareChange}
                  input={<Input name="file-compare" id="file-compare-helper" />}
                  displayEmpty
                  name="file-compare"
                  className={classes.selectEmpty}
                >
                  {fileNames ?
                    this.fileMenuCompareItems(fileNames)
                  :
                    ''}
                </Select>
                <FormHelperText style={{ fontSize:12+'px' }}>Select file to compare to</FormHelperText>
              </FormControl>
            </div>
            <div className="col-4 text-right">
              <Button
                style={{margin: 20}}
                onClick={this.displayGraphs}
                >
                <h6>Show Graphs</h6>
              </Button>
            </div>
          </div>
        </Paper>
          { showGraph ?
            <LineChart width={900} height={600} data={dataToShow}
              margin={{top: 10, right: 30, left: 0, bottom: 0}}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="name">
                <Label value={xAxisLabel} position="insideBottom" offset={2} />
              </XAxis>
              <YAxis domain={['dataMin-10', 'dataMax+10']} tickFormatter={this.formatYAxis}>
                <Label value={yAxisLabel} position="insideLeft" offset={0} />
              </YAxis>
              <Legend />
              <Tooltip/>
              <Line type='monotone' dataKey={dataKey1} stroke='#8884d8' dot={false} />
              <Line type='monotone' dataKey={dataKey2} stroke='#82ca9d' dot={false} />
              <Line type='monotone' dataKey={dataKey3} stroke='#e79797' dot={false} />
              <Line type='monotone' dataKey={dataKey4} stroke='#ed9f37' dot={false} />
              <Brush endIndex={endOfBrush - 1} onChange={this.alertBrush} />
            </LineChart>
            :
            ''
          }
      </div>
    );
  }
}

export default withStyles(styles)(ACIDualLineChart);
