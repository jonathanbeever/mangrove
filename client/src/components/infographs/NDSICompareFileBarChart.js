import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import ReactPlayer from 'react-player';
import {BarChart, Bar, ReferenceLine, Label, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

const styles = theme => ({
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    paddingLeft: theme.spacing.unit * 3,
    textAlign: 'center'
  }
});

class NDSICompareFileBarChart extends Component {
  constructor() {
    super();

    this.state = {
      showGraph: false,
      showAudio: false,
    };
  }

  componentDidMount = () => {
    let { results } = this.props;
    let fileNames = [...new Set(results.map(x => x.name))];
    this.setState({ fileNames });
    this.setState({ chosenFile: fileNames[0] });
  }

  formatYAxis = (tickItem) => {
    let asF = parseFloat(tickItem);
    return (asF).toFixed(2);
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

  handleBarClick = (data, index) => {
    let finalPath = data.payload.downloadUrl;

    let track = {
      title: data.payload.fileName,
      src: finalPath
    }

    this.setState({ track });
    this.setState({ showAudio: true });
  }

  formatJob = (chosen, compare) => {
    console.log(chosen);
    console.log(compare);
    if(compare.length === 0) compare[0] = {ndsiL:null,ndsiR:null,
                                          biophonyL:null,biophonyR:null,
                                          anthrophonyL:null,anthrophonyR:null};
    let ret = [
      {
        name: 'NDSI',
        fileName: chosen[0].name,
        ndsiL: chosen[0].ndsiL,
        ndsiR: chosen[0].ndsiR,
        downloadUrl: chosen[0].downloadUrl
      },
      {
        name: 'NDSIC',
        fileName: compare[0].name,
        ndsiL: compare[0].ndsiL,
        ndsiR: compare[0].ndsiR,
        downloadUrl: compare[0].downloadUrl
      },
      {
        name: 'Biophony',
        fileName: chosen[0].name,
        biophonyL: chosen[0].biophonyL,
        biophonyR: chosen[0].biophonyR,
        downloadUrl: chosen[0].downloadUrl
      },
      {
        name: 'BioC',
        fileName: compare[0].name,
        biophonyL: compare[0].biophonyL,
        biophonyR: compare[0].biophonyR,
        downloadUrl: compare[0].downloadUrl
      },
      {
        name: 'Anthrophony',
        fileName: chosen[0].name,
        anthrophonyL: chosen[0].anthrophonyL,
        anthrophonyR: chosen[0].anthrophonyR,
        downloadUrl: chosen[0].downloadUrl
      },
      {
        name: 'AnthroC',
        fileName: compare[0].name,
        anthrophonyL: compare[0].anthrophonyL,
        anthrophonyR: compare[0].anthrophonyR,
        downloadUrl: compare[0].downloadUrl
      }
    ];

    return ret;
  }

  displayGraph = () => {
    let { chosenFile, chosenCompareFile } = this.state;
    let { results } = this.props;
    let chosenData = results.filter(x => x.name === chosenFile);
    let compareData = results.filter(x => x.name === chosenCompareFile);
    let ret = this.formatJob(chosenData, compareData);
    this.setState({ dataToShow: ret });
    this.setState({ showGraph: true });
  }

  ref = player => {
    this.player = player;
  }

  render(){
    let { showGraph, dataToShow, chosenFile, chosenCompareFile, fileNames,
          showAudio, track } = this.state;
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
              <h6>Show Graphs</h6>
            </Button>
          </div>
        </div>
      { showGraph ?
        <div>
          <h5>To listen to a sound file, simply click on a bar, and an audio player will appear.</h5>
          <BarChart width={900} height={600} data={dataToShow}
            margin={{top: 10, right: 30, left: 0, bottom: 0}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name">
              <Label value="NDSI Values" position="insideBottom" offset={2} />
            </XAxis>
            <YAxis tickFormatter={this.formatYAxis}>
              <Label value="Value" position="insideLeft" offset={0} tickFormatter={this.formatYAxis} />
            </YAxis>
            <Tooltip />
            <Legend />
            <ReferenceLine y={0} stroke="#000" />
            <Bar onClick={this.handleBarClick} dataKey="ndsiL" fill="#8884d8" />
            <Bar onClick={this.handleBarClick} dataKey="ndsiR" fill="#615cd7" />
            <Bar onClick={this.handleBarClick} dataKey="biophonyL" fill="#82ca9d" />
            <Bar onClick={this.handleBarClick} dataKey="biophonyR" fill="#108f3f" />
            <Bar onClick={this.handleBarClick} dataKey="anthrophonyL" fill="#e79797" />
            <Bar onClick={this.handleBarClick} dataKey="anthrophonyR" fill="#e73535" />
          </BarChart>
        </div>
        :
        ''
      }
      { showAudio ?
        <div>
          <h5>{track.title}</h5>
          <ReactPlayer ref={this.ref}
                       height='65px'
                       url={track.src}
                       controls />
        </div>
        :
        ''
      }
      </div>
    );
  }
}

export default withStyles(styles)(NDSICompareFileBarChart);
