import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
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
  button: {
    paddingLeft: theme.spacing.unit * 3,
    textAlign: 'center'
  }
});

class ACICompareFileBandLineChart extends Component {
  constructor() {
    super();

    this.state = {
      showGraph: false,
    };
  }

  componentDidMount = () => {
    let { results } = this.props;
    let fileNames = [...new Set(results.map(x => x.fileName))];
    this.setState({ fileNames });
    this.setState({ chosenFile: fileNames[0] });
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps === null || nextProps === undefined) return;
    let fileNames = [...new Set(nextProps.results.map(x => x.fileName))];
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
      return <MenuItem key={"names"+file} value={file}>{file}</MenuItem>
    });
    return menuItems;
  }

  // Creates the items seen in the compare site menu
  fileMenuCompareItems = (fileNames) => {
    let { chosenFile } = this.state;

    const fileNamesWithoutChosen = fileNames.filter(file => file !== chosenFile);
    const menuItems = [<MenuItem key={"namesCompareNone"} value=""><em>None</em></MenuItem>].concat(fileNamesWithoutChosen.map(file => {
      return <MenuItem key={"namesCompare"+file} value={file}>{file}</MenuItem>
    }));

    return menuItems;
  }

  replaceACI = (compareData) => {
    compareData.forEach(item => {
      item['aciLeftC'] = item['aciLeft'];
      item['aciRightC'] = item['aciRight'];
      delete(item['aciLeft']);
      delete(item['aciRight']);
    });
    return compareData;
  }

  mergeByBand = (chosen, compare) => {
    console.log(chosen, compare);
    let indx = 0;
    chosen.forEach(item => {
      if(indx < compare.length)
      {
        item['aciLeftC'] = compare[indx].aciLeft;
        item['aciRightC'] = compare[indx].aciRight;
        indx++;
      }else
      {
        item['aciLeftC'] = undefined;
        item['aciRightC'] = undefined;
      }
    });

    return chosen;
  }

  formatJob = (chosen, compare) => {
    if(compare.length === 0) return chosen;
    let formattedCompare = this.mergeByBand(chosen, compare);
    return formattedCompare;
  }

  displayGraph = () => {
    let { chosenFile, chosenCompareFile } = this.state;
    let { results } = this.props;
    let chosenData = results.filter(x => x.fileName === chosenFile);
    let compareData = results.filter(x => x.fileName === chosenCompareFile);
    this.setState({ dataToShow: this.formatJob(chosenData, compareData) });
    this.setState({ showGraph: true });
  }

  render(){
    let { showGraph, dataToShow, chosenFile, chosenCompareFile, fileNames } = this.state;
    let { dataKey1, dataKey2, dataKey3, dataKey4 } = this.props;
    const { classes } = this.props;

    let endOfBrush;
    if(dataToShow){
      let len = dataToShow.length;
      if(len > 1500) endOfBrush = 1500;
      else endOfBrush = len;
    }

    return(
      <div>
        <div className="row">
          <div>
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
          <div>
            <Button
              style={{margin: 20}}
              onClick={this.displayGraph}
              >
              <h6>Show Graph</h6>
            </Button>
          </div>
        </div>
        { showGraph ?
          <div>
            <LineChart width={900} height={600} data={dataToShow}
              margin={{top: 10, right: 30, left: 0, bottom: 0}}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="name">
                <Label value="Hz Range" position="insideBottom" offset={2} />
              </XAxis>
              <YAxis domain={['dataMin-10', 'dataMax+10']} tickFormatter={this.formatYAxis}>
                <Label value="ACI Value" position="insideLeft" offset={0} />
              </YAxis>
              <Legend />
              <Tooltip/>
              <Line connectNulls={true} type='monotone' dataKey={dataKey1} stroke='#8884d8' dot={false} />
              <Line connectNulls={true} type='monotone' dataKey={dataKey2} stroke='#82ca9d' dot={false} />
              <Line connectNulls={true} type='monotone' dataKey={dataKey3} stroke='#e79797' dot={false} />
              <Line connectNulls={true} type='monotone' dataKey={dataKey4} stroke='#ed9f37' dot={false} />
              <Brush endIndex={endOfBrush - 1} onChange={this.alertBrush} />
            </LineChart>
          </div>
          :
          ''
        }
      </div>
    );
  }
}

export default withStyles(styles)(ACICompareFileBandLineChart);
