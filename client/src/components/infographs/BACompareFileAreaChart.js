import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import BACompareAreaChart from './BACompareAreaChart';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    paddingLeft: theme.spacing.unit * 3,
    textAlign: 'center'
  }
});

class BACompareFileAreaChart extends Component {
  constructor() {
    super();

    this.state = {
      showGraph: false,
    };
  }

  componentDidMount = () => {
    let { fileNames } = this.props;
    this.setState({ fileNames });
    this.setState({ chosenFile: fileNames[0] });
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

  replaceBI = (compareData) => {
    compareData.data.forEach(item => {
      item['leftSpectrumC'] = item['leftSpectrum'];
      item['rightSpectrumC'] = item['rightSpectrum'];
      delete(item['leftSpectrum']);
      delete(item['rightSpectrum']);
    });
    return compareData;
  }

  formatJob = (chosen, compare) => {
    console.log(chosen);
    let x = chosen.freqVals.length;
    if(compare === undefined || compare.length > 0)
    {
      compare = {areaL:0,areaR:0,freqVals:chosen.freqVals,valsL:new Array(x).fill(undefined),valsR:new Array(x).fill(undefined),valsNormalizedL:new Array(x).fill(undefined),valsNormalizedR:new Array(x).fill(undefined)};
    }

    let ret = {
      data: [],
      xAxisLabel: "Hz Range",
      yAxisLabel: "BI Value",
      dataKey1: "leftSpectrum",
      dataKey2: "rightSpectrum",
      dataKey3: "leftSpectrumC",
      dataKey4: "rightSpectrumC",
    };

    for(var i = 0; i < x; i++)
    {
      let curObject =
      {
        name: chosen.freqVals[i],
        leftSpectrum: chosen.valsNormalizedL[i],
        rightSpectrum: chosen.valsNormalizedR[i],
        leftSpectrumC: compare.valsNormalizedL[i],
        rightSpectrumC: compare.valsNormalizedR[i]
      }

      ret.data.push(curObject);
    }

    return ret;
  }

  displayGraph = () => {
    let { chosenFile, chosenCompareFile } = this.state;
    let { files } = this.props;
    let chosenData = files[chosenFile];
    let compareData = files[chosenCompareFile];
    this.setState({ dataToShow: this.formatJob(chosenData, compareData) });
    this.setState({ showGraph: true });
  }

  render(){
    let { showGraph, dataToShow, chosenFile, chosenCompareFile, fileNames } = this.state;
    const { classes } = this.props;

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
            <BACompareAreaChart
              callback={this.props.callback}
              results={dataToShow.data}
              xAxisLabel={dataToShow.xAxisLabel}
              yAxisLabel={dataToShow.yAxisLabel}
              dataKey1={dataToShow.dataKey1}
              dataKey2={dataToShow.dataKey2}
              dataKey3={dataToShow.dataKey3}
              dataKey4={dataToShow.dataKey4}
            />
          </div>
          :
          ''
        }
      </div>
    );
  }
}

export default withStyles(styles)(BACompareFileAreaChart);
