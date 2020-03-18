import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Slide from '@material-ui/core/Slide';
import IndexAnalysisPanel from './indexAnalysisPanel';
import SpecAnalysisPanel from './specAnalysisPanel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import * as utils from './dataModeling.js';
import ReactPlayer from 'react-player';
import Checkbox from '@material-ui/core/Checkbox';
import ExportCsv from '../selectResults/csvExport';
import AudioPlayer from '../infographs/components/AudioPlayer';
import axios from 'axios';
import AnnotationView from './annotationView';
import Popup from 'reactjs-popup';
var _ = require('lodash');

const styles = theme => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

class AnalysisView extends Component {
  constructor() {
    super();

    this.state = {
      errorMode: false,
      open: false,
      opened: false,
      checked: false,
      showAudio: false,
    };
  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
    let fromStorage = sessionStorage.getItem('analysisViewSave');
    if(fromStorage === "undefined" || fromStorage === null || fromStorage === undefined) sessionStorage.setItem('analysisViewSave', JSON.stringify(this.props.selectedJobs));
  }

  componentDidCatch = (error, info) => {
    this.setState({ errorMode: true });
  }

  componentDidMount = () => {
    let fromStorage = sessionStorage.getItem('analysisViewSave');
    let selectedJobs;
    if(fromStorage === "undefined" || fromStorage === null || fromStorage === undefined) selectedJobs = this.props.selectedJobs;
    else selectedJobs = JSON.parse(fromStorage);
    if(localStorage.getItem('analysisViewAlert') === null){
      localStorage.setItem('analysisViewAlert', true);
    }
    this.formatState(selectedJobs);
  }

  analysisViewAlertCallback = () => {
    if(!this.state.opened)
    {
      this.setState({ open: true });
      this.setState({ opened: true });
    }
  }

  refreshJobs = () => {

    let { selectedJobs, unfinished } = this.state;

    if(selectedJobs === undefined || unfinished === undefined) return;

    if(unfinished.length === 0){
      clearInterval(this.interval);
      return;
    }

    let jobRequests = [];

    unfinished.forEach(job => {
      jobRequests.push(axios.get('http://127.0.0.1:34251/jobs/'+job));
    });

    Promise.all(jobRequests)
      .then(responses => {
        // get jobs that have become finished
        let finished = responses.filter(resp => { return resp.data.status === "finished" }).map(resp => resp.data);
        let finishedId = finished.map(x => x.jobId);
        // get unfinished jobs
        let stillUnfinished = unfinished.filter(x => !finishedId.includes(x));
        if(finished.length)
        {
          for(var item in selectedJobs)
          {
            var index = selectedJobs[item];
            if(utils.isEmpty(index)) continue;
            for(var specId in index)
            {
              var jobs = index[specId];
              for(let i = 0; i < jobs.length; i++)
              {
                if(finishedId.includes(jobs[i].jobId))
                {
                  jobs[i].result = finished[finishedId.indexOf(jobs[i].jobId)].result;
                  jobs[i].status = "finished";
                }
              }
            }
          }
        }

        this.setState({ unfinished: stillUnfinished });
        this.setState({ selectedJobs: selectedJobs });
        this.displayGraphs();
      });
  }

  handleDoNotShowAgain = () => {
    this.setState({ checked: true });
  }

  handleClose = () => {
    let { checked } = this.state;
    if(checked) localStorage.setItem('analysisViewAlert', false);
    this.setState({ open: false });
  };

  hasUnfinished = (selectedJobs) => {
    let ret = [];
    for(var item in selectedJobs)
    {
      var index = selectedJobs[item];
      if(utils.isEmpty(index)) continue;
      for(var specId in index)
      {
        var jobs = index[specId];
        ret = ret.concat(jobs.filter(x => x.status !== "finished" && x.status !== "failed" && x.status !== "cancelled").map(x => x.jobId));
      }
    }
    return ret;
  }

  formatState = (selectedJobs) => {
    let series = [];
    let sites = [];
    let dict = {};

    if(selectedJobs === undefined || selectedJobs === null || selectedJobs.length === 0)
    {
      sites.push("ERROR");
      dict['ERROR'] = ["ERROR"];
    }else
    {
      for(var item in selectedJobs)
      {
        var index = selectedJobs[item];
        if(utils.isEmpty(index)) continue;
        for(var specId in index)
        {
          var jobs = index[specId];
          jobs.forEach(job => {
            if(!sites.includes(job.input.site))
            {
              sites.push(job.input.site);
              dict[job.input.site] = [];
            }
            if(!series.includes(job.input.series))
            {
              series.push(job.input.series);
              dict[job.input.site].push(job.input.series);
            }
          });
        }
      }
    }
    this.setState({ siteDict: dict });
    this.setState({ siteNames: sites });
    this.setState({ siteNamesCompare: sites.length > 1 ? sites.slice(1) : [] });
    this.setState({ seriesNames: dict[sites[0]] });
    this.setState({ seriesNamesCompare: series.length > 1 ? series.slice(1) : [] });
    this.setState({ chosenSite: sites[0] });
    this.setState({ chosenSeries: dict[sites[0]][0] });
    this.setState({ formattedJob: null });
    this.setState({ selectedJobs: selectedJobs });
  }

  // Formats the data passed into it into a model usable by recharts.
  // Then, it creates the Paper and ExpansionPanel components used
  // for displaying the graphs themselves.
  formatJob = async (data) => {
    const rows = [];
    let specRows = [];
    let graphs;

    let { indexedSpecs } = this.props;
    let { chosenSite, chosenSeries } = this.state;

    // loop through each input index
    for (var index in data) {
      var obj = data[index];

      // don't make a Paper if the index is empty
      if(utils.isEmpty(obj)) continue;

      specRows = [];
      for(var spec in obj) {

        var csvExport = (
          <ExportCsv
            jobs={obj[spec]}
            index={index}
            site={chosenSite}
            series={chosenSeries}
          />
        )

        switch(index)
        {
          case "aci":
            try{
              graphs = utils.convertACIResults(obj[spec]);
            }catch(error){
              this.setState({ errorMessage: error });
              this.setState({ errorMode: true });
            }
            break;
          case "ndsi":
            try{
              graphs = utils.convertNDSIResults(obj[spec]);
            }catch(error){
              this.setState({ errorMessage: error });
              this.setState({ errorMode: true });
            }
            break;
          case "adi":
            try{
              graphs = utils.convertADIResults(obj[spec]);
            }catch(error){
              this.setState({ errorMessage: error });
              this.setState({ errorMode: true });
            }
            break;
          case "aei":
            try{
              graphs = utils.convertAEIResults(obj[spec]);
            }catch(error){
              this.setState({ errorMessage: error });
              this.setState({ errorMode: true });
            }
            break;
          case "bi":
            try{
              graphs = utils.convertBIResults(obj[spec]);
            }catch(error){
              this.setState({ errorMessage: error });
              this.setState({ errorMode: true });
            }
            break;
          case "rms":
            try{
              graphs = utils.convertRMSResults(obj[spec]);
            }catch(error){
              this.setState({ errorMessage: error });
              this.setState({ errorMode: true });
            }
            break;
          default:
            graphs = null
        }

        let specTitle = utils.createSpecTitle(indexedSpecs[spec]);
        if(index === 'rms') specTitle = "RMS Results";

        specRows.push(
          <ExpansionPanel key={index + spec}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <p style={{fontSize: 16+'px'}}>{specTitle}</p>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <SpecAnalysisPanel
                index={index}
                spec={spec}
                graphs={graphs}
                callback={this.analysisViewAlertCallback}
                audioCallback={this.handleAudioPlayerOpen}
                initializeAnnotationViewData={this.initializeAnnotationViewData}
                annotations={await this.getAnnotations(spec)}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )
      }

      rows.push(
        <Paper key={index}>
          <div className="row">
            <div className="col-8">
              <h3 style={{ paddingLeft: 15+'px', paddingTop: 15+'px' }}>{index.toUpperCase()}</h3>
            </div>
            <div className="col-4" style={{ paddingLeft: 50+'px', paddingTop: 30+'px' }}>
              {csvExport}
            </div>
          </div>
          <p style={{ paddingLeft: 15+'px', fontSize:12+'px' }}>Graphs available for { chosenSite } - { chosenSeries }</p>
          <IndexAnalysisPanel
            specRows={specRows}
          />
        </Paper>
      )
    }

    var formattedJob = (
      <div>
        {rows}
      </div>
    )

    this.setState({ formattedJob: formattedJob })
  }

  // Formats the data passed into it into a model usable by recharts.
  // Then, it creates the Paper and ExpansionPanel components used
  // for displaying the graphs for comparing jobs across sites.
  formatJobSite = (data) => {
    const rows = [];
    let specRows = [];
    let graphs;

    let { indexedSpecs } = this.props;
    let { chosenSite, chosenCompareSite, chosenSeries, chosenCompareSeries } = this.state;

    // loop through each input index
    for (var index in data) {
      var obj = data[index];

      // don't make a Paper if the index is empty
      if(utils.isEmpty(obj)) continue;

      specRows = [];
      for(var spec in obj) {
        switch(index)
        {
          case "aci":
            try{
              graphs = utils.convertACIResultsBySite(obj[spec], [chosenSite, chosenCompareSite]);
            }catch(error){
              this.setState({ errorMessage: error });
              this.setState({ errorMode: true });
            }
            break;
          case "ndsi":
            try{
              graphs = utils.convertNDSIResultsBySite(obj[spec], [chosenSite, chosenCompareSite]);
            }catch(error){
              this.setState({ errorMessage: error });
              this.setState({ errorMode: true });
            }
            break;
          case "adi":
            try{
              graphs = utils.convertADIResultsBySite(obj[spec], [chosenSite, chosenCompareSite]);
            }catch(error){
              this.setState({ errorMessage: error });
              this.setState({ errorMode: true });
            }
            break;
          case "aei":
            try{
              graphs = utils.convertAEIResultsBySite(obj[spec], [chosenSite, chosenCompareSite]);
            }catch(error){
              this.setState({ errorMessage: error });
              this.setState({ errorMode: true });
            }
            break;
          case "bi":
            try{
              graphs = utils.convertBIResultsBySite(obj[spec], [chosenSite, chosenCompareSite]);
            }catch(error){
              this.setState({ errorMessage: error });
              this.setState({ errorMode: true });
            }
            break;
          case "rms":
            try{
              graphs = utils.convertRMSResultsBySite(obj[spec], [chosenSite, chosenCompareSite]);
            }catch(error){
              this.setState({ errorMessage: error });
              this.setState({ errorMode: true });
            }
            break;
          default:
            graphs = null
        }

        let specTitle = utils.createSpecTitle(indexedSpecs[spec]);
        if(index === 'rms') specTitle = "RMS Compared By Site and Series";

        specRows.push(
          <ExpansionPanel key={index + spec}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <p style={{fontSize: 16+'px'}}>{specTitle}</p>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <SpecAnalysisPanel
                index={index+"-compare"}
                spec={spec}
                graphs={graphs}
                callback={this.analysisViewAlertCallback}
                audioCallback={this.handleAudioPlayerOpen}
                initializeAnnotationViewData={this.initializeAnnotationViewData}
                annotations={this.getAnnotations(spec)}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )
      }

      rows.push(
        <Paper key={index}>
          <h3 style={{ paddingLeft: 15+'px', paddingTop: 15+'px' }}>{index.toUpperCase()} By Site and Series</h3>
          <p style={{ paddingLeft: 15+'px', fontSize:12+'px' }}>Graphs available for comparing { chosenSite } - { chosenSeries } and { chosenCompareSite } - { chosenCompareSeries }</p>
          <p style={{ paddingLeft: 15+'px', fontSize:12+'px' }}>The items denoted with a 'C' at the end are from the site you chose to compare</p>
          <IndexAnalysisPanel
            specRows={specRows}
          />
        </Paper>
      )
    }

    var comparedJobsSite = (
      <div>
        {rows}
      </div>
    );

    this.setState({ comparedJobsSite: comparedJobsSite });

  }

  // Formats the data passed into it into a model usable by recharts.
  // Then, it creates the Paper and ExpansionPanel components used
  // for displaying the graphs for comparing jobs across series.
  formatJobSeries = (data) => {
    const rows = [];
    let specRows = [];
    let graphs;

    let { indexedSpecs } = this.props;
    let { chosenSeries, chosenCompareSeries } = this.state;

    // loop through each input index
    for (var index in data) {
      var obj = data[index];

      // don't make a Paper if the index is empty
      if(utils.isEmpty(obj)) continue;

      specRows = [];
      for(var spec in obj) {
        switch(index)
        {
          case "aci":
            try{
              graphs = utils.convertACIResultsBySeries(obj[spec], [chosenSeries, chosenCompareSeries]);
            }catch(error){
              this.setState({ errorMessage: error });
              this.setState({ errorMode: true });
            }
            break;
          case "ndsi":
            try{
              graphs = utils.convertNDSIResultsBySeries(obj[spec], [chosenSeries, chosenCompareSeries]);
            }catch(error){
              this.setState({ errorMessage: error });
              this.setState({ errorMode: true });
            }
            break;
          case "adi":
            try{
              graphs = utils.convertADIResultsBySeries(obj[spec], [chosenSeries, chosenCompareSeries]);
            }catch(error){
              this.setState({ errorMessage: error });
              this.setState({ errorMode: true });
            }
            break;
          case "aei":
            try{
              graphs = utils.convertAEIResultsBySeries(obj[spec], [chosenSeries, chosenCompareSeries]);
            }catch(error){
              this.setState({ errorMessage: error });
              this.setState({ errorMode: true });
            }
            break;
          case "bi":
            try{
              graphs = utils.convertBIResultsBySeries(obj[spec], [chosenSeries, chosenCompareSeries]);
            }catch(error){
              this.setState({ errorMessage: error });
              this.setState({ errorMode: true });
            }
            break;
          case "rms":
            graphs = utils.convertRMSResultsBySeries(obj[spec], [chosenSeries, chosenCompareSeries]);
            try{
              graphs = utils.convertRMSResultsBySeries(obj[spec], [chosenSeries, chosenCompareSeries]);
            }catch(error){
              this.setState({ errorMessage: error });
              this.setState({ errorMode: true });
            }
            break;
          default:
            graphs = null
        }

        let specTitle = utils.createSpecTitle(indexedSpecs[spec]);
        if(index === 'rms') specTitle = "RMS Compared By Series";

        specRows.push(
          <ExpansionPanel key={index + spec}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <p style={{fontSize: 16+'px'}}>{specTitle}</p>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <SpecAnalysisPanel
                index={index+'-compare'}
                spec={spec}
                graphs={graphs}
                callback={this.analysisViewAlertCallback}
                audioCallback={this.handleAudioPlayerOpen}
                initializeAnnotationViewData={this.initializeAnnotationViewData}
                annotations={this.getAnnotations(spec)}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )
      }

      rows.push(
        <Paper key={index}>
          <h3 style={{ paddingLeft: 15+'px', paddingTop: 15+'px' }}>{index.toUpperCase()} By Series</h3>
          <p style={{ paddingLeft: 15+'px', fontSize:12+'px' }}>Graphs available for comparing { chosenSeries } and { chosenCompareSeries }</p>
          <p style={{ paddingLeft: 15+'px', fontSize:12+'px' }}>The items denoted with a 'C' at the end are from the series you chose to compare</p>
          <IndexAnalysisPanel
            specRows={specRows}
          />
        </Paper>
      )
    }

    var comparedJobsSeries = (
      <div>
        {rows}
      </div>
    )

    this.setState({ comparedJobsSeries: comparedJobsSeries });

  }

  // Handler for the Show Graphs button
  displayGraphs = () => {

    let { chosenSite, chosenSeries, chosenCompareSite, chosenCompareSeries } = this.state;
    let { selectedJobs } = this.state;
    let index;
    let item;
    let specId;
    let jobs;
    let filteredChosenJobs;
    let filteredChosenInputs;

    let unfinished = this.hasUnfinished(selectedJobs);
    if(unfinished.length > 0){
      this.setState({ unfinished: unfinished });
      if(this.interval === undefined) this.interval = setInterval(() => this.refreshJobs(), 10000);
    }

    // get jobs for only the chosen site and series
    filteredChosenJobs = _.cloneDeep(selectedJobs);
    for(item in filteredChosenJobs)
    {
      index = filteredChosenJobs[item];
      for(specId in index)
      {
        jobs = index[specId];
        index[specId] = jobs.filter(x => x.input.series === chosenSeries && x.input.site === chosenSite);
        filteredChosenInputs = index[specId].map(x => x.input);
      }
    }
    // create base graphs
    this.formatJob(filteredChosenJobs);

    // check if user has selected both a site and series to compare
    if(chosenCompareSite && chosenCompareSeries)
    {
      // get jobs from fullJobs where the site and series match
      filteredChosenJobs = _.cloneDeep(selectedJobs);
      for(item in filteredChosenJobs)
      {
        index = filteredChosenJobs[item];
        for(specId in index)
        {
          jobs = index[specId];
          index[specId] = jobs.filter(x => (x.input.site === chosenSite && x.input.series === chosenSeries) || (x.input.site === chosenCompareSite && x.input.series === chosenCompareSeries));
          filteredChosenInputs = (index[specId].map(x => x.input));
        }
      }
      this.formatJobSite(filteredChosenJobs);
    }

    //  check if user has selected only a series to compare
    if(chosenCompareSeries && !chosenCompareSite)
    {
      // get jobs from fullJobs where the site and series match
      filteredChosenJobs = _.cloneDeep(selectedJobs);
      for(item in filteredChosenJobs)
      {
        index = filteredChosenJobs[item];
        for(specId in index)
        {
          jobs = index[specId];
          index[specId] = jobs.filter(x => x.input.series === chosenSeries || x.input.series === chosenCompareSeries);
          filteredChosenInputs = (index[specId].map(x => x.input));
        }
      }

      this.formatJobSeries(filteredChosenJobs);
    }

    this.setState({ files: filteredChosenInputs.map(x => x.name) });
    this.setState({ urls: filteredChosenInputs.map(x => x.downloadUrl) });
  }

  // Handler for the site Select
  handleSiteChange = event => {
    let { siteDict, siteNames } = this.state;
    let chosenSite = event.target.value;
    let chosenSiteSeries = siteDict[chosenSite];
    this.setState({ siteNamesCompare: siteNames.filter(site => site !== chosenSite) });
    this.setState({ seriesNames: chosenSiteSeries });
    this.setState({ seriesNamesCompare: chosenSiteSeries.length > 1 ? chosenSiteSeries.filter(series => series !== chosenSiteSeries[0]) : [] });
    this.setState({ chosenSite: chosenSite });
    this.setState({ chosenSeries: chosenSiteSeries[0] });
    this.setState({ comparedJobsSeries: null });
    this.setState({ comparedJobsSite: null });
    this.setState({ [event.target.name]: event.target.value });
  }

  // Handler for the site-compare Select
  handleSiteCompareChange = event => {
    let { siteDict, chosenSeries } = this.state;
    let chosenCompareSite = event.target.value;
    this.setState({ chosenCompareSite: chosenCompareSite });
    this.setState({ [event.target.name]: event.target.value });
    if(chosenCompareSite === "")
    {
      this.setState({ chosenSeries: chosenSeries });
      this.setState({ comparedJobsSite: null });
    }
    else this.setState({ chosenCompareSeries: siteDict[chosenCompareSite][0] });
  }

  // Handler for the series Select
  handleSeriesChange = event => {
    let chosenSeries = event.target.value;
    this.setState({ chosenSeries: chosenSeries });
    this.setState({ [event.target.name]: event.target.value });
  }

  // Handler for the series-compare Select
  handleSeriesCompareChange = event => {
    let chosenCompareSeries = event.target.value;
    this.setState({ chosenCompareSeries: chosenCompareSeries });
    this.setState({ [event.target.name]: event.target.value });
    if(chosenCompareSeries === "") this.setState({ comparedJobsSeries: null });
  }

  // Creates the items seen in the site menu
  siteMenuItems = (siteNames) => {
    const menuItems = siteNames.map(site => {
      return <MenuItem key={"site"+site} value={site}>{site}</MenuItem>
    });
    return menuItems;
  }

  // Creates the items seen in the compare site menu
  siteMenuCompareItems = (siteNames) => {
    let { chosenSite } = this.state;

    const siteNamesWithoutChosen = siteNames.filter(site => site !== chosenSite);
    const menuItems = [<MenuItem key="siteNone" value=""><em>None</em></MenuItem>].concat(siteNamesWithoutChosen.map(site => {
      return <MenuItem key={"siteCompare"+site} value={site}>{site}</MenuItem>
    }));

    return menuItems;
  }

  // Creates the items seen in the series menu
  seriesMenuItems = (seriesNames) => {
    const menuItems = seriesNames.map(series => {
      return <MenuItem key={"series"+series} value={series}>{series}</MenuItem>
    });
    return menuItems;
  }

  // Creates the items seen in the compare series menu
  seriesMenuCompareItems = (seriesNames) => {
    let { chosenSeries, chosenSite, chosenCompareSite, siteDict } = this.state;
    let chosenCompareSeriesNames;
    if(siteDict[chosenCompareSite]) chosenCompareSeriesNames = siteDict[chosenCompareSite];
    else chosenCompareSeriesNames = siteDict[chosenSite];

    const seriesNamesWithoutChosen = chosenCompareSeriesNames.filter(series => series !== chosenSeries);
    const menuItems = [<MenuItem key={"seriesNone"} value=""><em>None</em></MenuItem>].concat(seriesNamesWithoutChosen.map(series => {
      return <MenuItem key={"seriesCompare"+series} value={series}>{series}</MenuItem>
    }));

    return menuItems;
  }

  audioError = () => {
    let track = {
      title: "Error playing audio file",
      startTime: 0,
      src: ''
    }

    this.setState({ track });
  }

  closeAudioPlayer = () => {
    if(this.player) this.player.playing = false;
    this.setState({ showAudio: false });
  }

  initializeAnnotationViewData = (data) => {
    let mainJobId = data.mainJobId;
    let aciLeft = data.payload.aciLeft;
    let aciRight = data.payload.aciRight;
    let stamp = data.payload.stamp;
    let graph = data.graph;
    let title;

    if(data.payload.fileName) title = data.payload.fileName;
    else title = data.payload.name;

    const new_state = {
      showAnnotationView: true,
      aciLeft: aciLeft,
      aciRight: aciRight,
      stamp: stamp,
      title: title,
      mainJobId: mainJobId,
      graph: graph
    };

    this.setState(new_state);
  }

  handleAudioPlayerOpen = (data, index) => {
    let seconds;
    let finalPath;
    let title;

    if(data.payload)
    {
      if(data.payload.stamp) seconds = parseFloat(data.payload.stamp);
      else seconds = 0;
      if(data.payload.fileName) title = data.payload.fileName;
      else title = data.payload.name;
      finalPath = data.payload.downloadUrl;
    }else
    {
      seconds = 0;
      title = data.title;
      finalPath = data.src;
    }

    let track = {
      title: title,
      startTime: seconds,
      src: finalPath
    }

    this.setState({ track });
    this.setState({ showAudio: true }, () => {
      if(this.player) this.player.seekTo(track.startTime);
    });
  }

  handleCreateAnnotation = (annotationData) => {
    const annotation = {
      jobId: this.state.mainJobId,
      annotation: annotationData.note,
      graph: annotationData.graph,
      dataPoint: {
        X: annotationData.stamp,
        Y1: annotationData.aciLeft,
        Y2: annotationData.aciRight,
      }
    };
    
    const url = 'http://127.0.0.1:34251/annotations';

    axios.put(url, annotation).catch((err) => console.log(err));
  }

  getAnnotations = async (jobId) => {
    const url = 'http://127.0.0.1:34251/annotations/' + jobId;

    const request = await axios.get(url);
    return request.data.annotations;
  }

  closeAnnotationView = () => {
    const new_state = {
      showAnnotationView: false,
      aciLeft: null,
      aciRight: null,
      stamp: null,
      title: null
    }

    this.setState(new_state);
  }

  ref = player => {
    this.player = player;
  }

  render() {
    axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('id');

    let { errorMode, formattedJob, comparedJobsSite, files, urls,
          comparedJobsSeries, siteNames, siteNamesCompare, seriesNames, seriesNamesCompare, chosenSite,
          chosenSeries, chosenCompareSite, chosenCompareSeries, showAudio, track,
          aciLeft, aciRight, showAnnotationView, stamp, title, graph } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <Popup 
          open={showAnnotationView}
          onClose={this.closeAnnotationView}
          modal 
          closeOnDocumentClick 
          position="right center"
        >
          <AnnotationView 
            aciLeft={aciLeft}
            aciRight={aciRight}
            stamp={stamp}
            title={title}
            graph={graph}
            handleCreateAnnotation={this.handleCreateAnnotation}
          />
        </Popup>
        <div style={{ marginBottom:25+'px', marginTop:22+'px' }}>
          {errorMode ?
          'An error occurred. ' + this.state.errorMessage
          :
          <div>
            <Paper style={{ marginTop:10+'px', marginBottom:20+'px' }}>
              <div className="row">
                <div className="col-8">
                  <FormControl style={{ marginLeft:10+'px', marginBottom:10+'px' }}>
                    <InputLabel shrink htmlFor="site-helper"><h4>Site</h4></InputLabel>
                    <Select
                      value={chosenSite ? chosenSite : ''}
                      onChange={this.handleSiteChange}
                      input={<Input name="site" id="site-helper" />}
                      displayEmpty
                      name="site"
                      className={classes.selectEmpty}
                    >
                      {siteNames ?
                        this.siteMenuItems(siteNames)
                      :
                        ''}
                    </Select>
                    <FormHelperText style={{ fontSize:12+'px' }}>Select site to view graphs</FormHelperText>
                  </FormControl>
                  <FormControl style={{ marginLeft:10+'px', marginBottom:10+'px' }}>
                    <InputLabel shrink htmlFor="site-compare-helper"><h4>Site to compare</h4></InputLabel>
                    <Select
                      value={chosenCompareSite ? chosenCompareSite : ''}
                      onChange={this.handleSiteCompareChange}
                      input={<Input name="site-compare" id="site-compare-helper" />}
                      displayEmpty
                      name="site-compare"
                      className={classes.selectEmpty}
                    >
                      {siteNamesCompare ?
                        this.siteMenuCompareItems(siteNamesCompare)
                      :
                        ''}
                    </Select>
                    <FormHelperText style={{ fontSize:12+'px' }}>Select a site to compare to</FormHelperText>
                  </FormControl>
                  <FormControl style={{ marginLeft:20+'px', marginBottom:10+'px' }}>
                    <InputLabel shrink htmlFor="series-helper"><h4>Series</h4></InputLabel>
                    <Select
                      value={chosenSeries ? chosenSeries : ''}
                      onChange={this.handleSeriesChange}
                      input={<Input name="series" id="series-helper" />}
                      displayEmpty
                      name="series"
                      className={classes.selectEmpty}
                    >
                      {seriesNames ?
                        this.seriesMenuItems(seriesNames)
                      :
                        ''}
                    </Select>
                    <FormHelperText style={{ fontSize:12+'px' }}>Select series to view graphs</FormHelperText>
                  </FormControl>
                  <FormControl style={{ marginLeft:10+'px', marginBottom:10+'px' }}>
                    <InputLabel shrink htmlFor="series-compare-helper"><h4>Series to compare</h4></InputLabel>
                    <Select
                      value={chosenCompareSeries ? chosenCompareSeries : ''}
                      onChange={this.handleSeriesCompareChange}
                      input={<Input name="series-compare" id="series-compare-helper" />}
                      displayEmpty
                      name="series-compare"
                      className={classes.selectEmpty}
                    >
                      {seriesNamesCompare ?
                        this.seriesMenuCompareItems(seriesNamesCompare)
                      :
                        ''}
                    </Select>
                    <FormHelperText style={{ fontSize:12+'px' }}>Select a series to compare to</FormHelperText>
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
                <Dialog
                  open={this.state.open}
                  TransitionComponent={Slide}
                  keepMounted
                  onClose={this.handleClose}
                  aria-labelledby="alert-dialog-slide-title"
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Performance Warning"}</DialogTitle>
                  <DialogContent>
                    <h5>Warning: Increasing the scale of a graph this large may cause client performance issues. It is recommended that you stay at lower ranges for best performance.</h5>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleClose} style={{backgroundColor:"#b6cd26", margin: 7+'px'}}>
                      <h6>Ok</h6>
                    </Button>
                    <FormControlLabel
                    control={
                      <Checkbox value="donotshow"
                        style={{color: '#b6cd26', margin: 7+'px', marginLeft: 7+'px'}}
                        onChange={this.handleDoNotShowAgain}/>
                    }
                    label="Do not show this message again"
                    />
                  </DialogActions>
                </Dialog>
              </div>
            </Paper>
            { files ?
              <Paper key="audio">
                <AudioPlayer
                  key="audioPlayer"
                  files={files}
                  urls={urls}
                  audioCallback={this.handleAudioPlayerOpen}
                />
              </Paper>
              :
              ''}
            { formattedJob ?
              formattedJob
              :
              ''}
            { comparedJobsSite ?
              comparedJobsSite
              :
              ''}
            { comparedJobsSeries ?
              comparedJobsSeries
              :
              ''}
          </div>
          }
        </div>
        { showAudio ?
          <div style={{ width:'100%', paddingLeft:0+'px', paddingRight:0+'px' }}>
            <div style={{ marginTop:10+'px', display:'block', height:130+'px', width:'100%' }} />
            <div style={{ position:'fixed', left:'auto', bottom:25+'px', height:100+'px', padding:0+'px' }}>
              <div className="container text-center" style={{ borderStyle:'solid', borderWidth:1+'px', borderColor:'#e0e0e0', borderRadius:25+'px', width:1110+'px', backgroundColor:"#f1f3f4", margin:0+'px', padding:0+'px' }}>
                <div className="row">
                  <div className="col-8 text-right" style={{ paddingRight:70+'px' }}>
                    <h5 style={{ marginTop:10+'px', marginBottom:0+'px' }}>{track.title}</h5>
                  </div>
                  <div className="col-4 text-right" style={{ paddingRight:30+'px' }}>
                    <button style={{ background:'none', border:'none', padding:0, cursor:'pointer' }}
                           onClick={this.closeAudioPlayer}>
                     <i className="tiny material-icons">close</i>
                    </button>
                  </div>
                </div>
                <ReactPlayer ref={this.ref}
                             onError={this.audioError}
                             height='65px'
                             width='100%'
                             url={track.src}
                             controls />
              </div>
            </div>
          </div>
          :
          ''}
      </div>  
    );
  }
}

export default withStyles(styles)(AnalysisView);
