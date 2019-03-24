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
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import * as utils from './dataModeling.js';
import Checkbox from '@material-ui/core/Checkbox';
import axios from 'axios';

const styles = theme => ({
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AnalysisView extends Component {
  constructor() {
    super();

    this.state = {
      errorMode: false,
      open: false,
      opened: false,
      checked: false,
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
    console.log(selectedJobs);
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
      jobRequests.push(axios.get('http://localhost:3000/jobs/'+job));
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
    console.log("hello?");
    this.setState({ checked: true });
  }

  handleClose = () => {
    let { checked } = this.state;
    console.log("In handleclose");
    console.log(checked);
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

    for(var item in selectedJobs)
    {
      var index = selectedJobs[item];
      if(utils.isEmpty(index)) continue;
      for(var specId in index)
      {
        var jobs = index[specId];
        jobs.forEach(job => {
          if(!series.includes(job.input.series))
          {
            series.push(job.input.series);
          }
          if(!sites.includes(job.input.site))
          {
            sites.push(job.input.site);
          }
        });
      }
    }

    this.setState({ siteNames: sites });
    this.setState({ chosenSite: sites[0] });
    this.setState({ seriesNames: series });
    this.setState({ chosenSeries: series[0] });
    this.setState({ formattedJob: null });
    this.setState({ selectedJobs: selectedJobs });
  }

  // Formats the data passed into it into a model usable by recharts.
  // Then, it creates the Paper and ExpansionPanel components used
  // for displaying the graphs themselves.
  formatJob = (data) => {
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
        switch(index)
        {
          case "aci":
            try{
              graphs = utils.convertACIResults(obj[spec]);
            }catch(error){
              this.setState({ errorMode: true });
            }
            break;
          case "ndsi":
            try{
              graphs = utils.convertNDSIResults(obj[spec]);
            }catch(error){
              this.setState({ errorMode: true });
            }
            break;
          case "adi":
            try{
              graphs = utils.convertADIResults(obj[spec]);
            }catch(error){
              this.setState({ errorMode: true });
            }
            break;
          case "aei":
            try{
              graphs = utils.convertAEIResults(obj[spec]);
            }catch(error){
              this.setState({ errorMode: true });
            }
            break;
          case "bi":
            try{
              graphs = utils.convertBIResults(obj[spec]);
            }catch(error){
              this.setState({ errorMode: true });
            }
            break;
          default:
            graphs = null
        }

        let specTitle = utils.createSpecTitle(indexedSpecs[spec]);

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
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )
      }

      rows.push(
        <Paper key={index}>
          <h3 style={{ paddingLeft: 15+'px', paddingTop: 15+'px' }}>{index.toUpperCase()}</h3>
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
    let { chosenSite, chosenCompareSite } = this.state;

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
              this.setState({ errorMode: true });
            }
            break;
          case "ndsi":
            try{
              graphs = utils.convertNDSIResultsBySite(obj[spec], [chosenSite, chosenCompareSite]);
            }catch(error){
              this.setState({ errorMode: true });
            }
            break;
          case "adi":
            try{
              graphs = utils.convertADIResultsBySite(obj[spec], [chosenSite, chosenCompareSite]);
            }catch(error){
              this.setState({ errorMode: true });
            }
            break;
          case "aei":
            try{
              graphs = utils.convertAEIResultsBySite(obj[spec], [chosenSite, chosenCompareSite]);
            }catch(error){
              this.setState({ errorMode: true });
            }
            break;
          case "bi":
            try{
              graphs = utils.convertBIResultsBySite(obj[spec], [chosenSite, chosenCompareSite]);
            }catch(error){
              this.setState({ errorMode: true });
            }
            break;
          default:
            graphs = null
        }

        let specTitle = utils.createSpecTitle(indexedSpecs[spec]);

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
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )
      }

      rows.push(
        <Paper key={index}>
          <h3 style={{ paddingLeft: 15+'px', paddingTop: 15+'px' }}>{index.toUpperCase()} By Site</h3>
          <p style={{ paddingLeft: 15+'px', fontSize:12+'px' }}>Graphs available for comparing { chosenSite } and { chosenCompareSite }</p>
          <p style={{ paddingLeft: 15+'px', fontSize:12+'px' }}>The items denoted with a 'C' at the end are the series you chose to compare</p>
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
        console.log(obj[spec]);
        switch(index)
        {
          case "aci":
            try{
              graphs = utils.convertACIResultsBySeries(obj[spec], [chosenSeries, chosenCompareSeries]);
            }catch(error){
              this.setState({ errorMode: true });
            }
            break;
          case "ndsi":
            try{
              graphs = utils.convertNDSIResultsBySeries(obj[spec], [chosenSeries, chosenCompareSeries]);
            }catch(error){
              this.setState({ errorMode: true });
            }
            break;
          case "adi":
            try{
              graphs = utils.convertADIResultsBySeries(obj[spec], [chosenSeries, chosenCompareSeries]);
            }catch(error){
              this.setState({ errorMode: true });
            }
            break;
          case "aei":
            try{
              graphs = utils.convertAEIResultsBySeries(obj[spec], [chosenSeries, chosenCompareSeries]);
            }catch(error){
              this.setState({ errorMode: true });
            }
            break;
          case "bi":
            try{
              graphs = utils.convertBIResultsBySeries(obj[spec], [chosenSeries, chosenCompareSeries]);
            }catch(error){
              this.setState({ errorMode: true });
            }
            break;
          default:
            graphs = null
        }

        let specTitle = utils.createSpecTitle(indexedSpecs[spec]);

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
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )
      }

      rows.push(
        <Paper key={index}>
          <h3 style={{ paddingLeft: 15+'px', paddingTop: 15+'px' }}>{index.toUpperCase()} By Series</h3>
          <p style={{ paddingLeft: 15+'px', fontSize:12+'px' }}>Graphs available for comparing { chosenSeries } and { chosenCompareSeries }</p>
          <p style={{ paddingLeft: 15+'px', fontSize:12+'px' }}>The items denoted with a 'C' at the end are the series you chose to compare</p>
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

    console.log(selectedJobs);

    let index;
    let item;
    let specId;
    let jobs;
    let filteredSelectedJobs;

    let unfinished = this.hasUnfinished(selectedJobs);
    if(unfinished.length > 0){
      this.setState({ unfinished: unfinished });
      if(this.interval === undefined) this.interval = setInterval(() => this.refreshJobs(), 10000);
    }

    // get jobs for only the chosen site and series
    let filteredChosenJobs = selectedJobs;
    for(item in filteredChosenJobs)
    {
      index = filteredChosenJobs[item];
      for(specId in index)
      {
        jobs = index[specId];
        index[specId] = jobs.filter(x => x.input.series === chosenSeries && x.input.site === chosenSite);
      }
    }

    // create base graphs
    this.formatJob(filteredChosenJobs);

    // check if user has selected a site to compare
    if(chosenCompareSite)
    {
      // get jobs from fullJobs where the site and series match
      filteredSelectedJobs = selectedJobs;
      for(item in filteredSelectedJobs)
      {
        index = filteredSelectedJobs[item];
        for(specId in index)
        {
          jobs = index[specId];
          index[specId] = jobs.filter(x => x.input.series === chosenSeries && (x.input.site === chosenSite || x.input.site === chosenCompareSite));
        }
      }
      this.formatJobSite(filteredSelectedJobs);
    }

    //  check if user has selected a series to compare
    if(chosenCompareSeries)
    {
      // get jobs from fullJobs where the site and series match
      filteredSelectedJobs = selectedJobs;
      for(item in filteredSelectedJobs)
      {
        index = filteredSelectedJobs[item];
        for(specId in index)
        {
          jobs = index[specId];
          index[specId] = jobs.filter(x => (x.input.series === chosenSeries || x.input.series === chosenCompareSeries) && x.input.site === chosenSite);
        }
      }
      console.log(filteredSelectedJobs);
      this.formatJobSeries(filteredSelectedJobs);
    }
  }

  // Handler for the site Select
  handleSiteChange = event => {
    this.setState({ chosenSite: event.target.value });
    this.setState({ [event.target.name]: event.target.value });
  }

  // Handler for the site-compare Select
  handleSiteCompareChange = event => {
    this.setState({ chosenCompareSite: event.target.value });
    this.setState({ [event.target.name]: event.target.value });
  }

  // Handler for the series Select
  handleSeriesChange = event => {
    this.setState({ chosenSeries: event.target.value });
    this.setState({ [event.target.name]: event.target.value });
  }

  // Handler for the series-compare Select
  handleSeriesCompareChange = event => {
    this.setState({ chosenCompareSeries: event.target.value });
    this.setState({ [event.target.name]: event.target.value });
  }

  // Creates the items seen in the site menu
  siteMenuItems = (siteNames) => {
    const menuItems = siteNames.map(site => {
      return <MenuItem key={site} value={site}>{site}</MenuItem>
    });
    return menuItems;
  }

  // Creates the items seen in the compare site menu
  siteMenuCompareItems = (siteNames) => {
    let { chosenSite } = this.state;

    const siteNamesWithoutChosen = siteNames.filter(site => site !== chosenSite);
    const menuItems = [<MenuItem value=""><em>None</em></MenuItem>].concat(siteNamesWithoutChosen.map(site => {
      return <MenuItem value={site}>{site}</MenuItem>
    }));

    return menuItems;
  }

  // Creates the items seen in the series menu
  seriesMenuItems = (seriesNames) => {
    const menuItems = seriesNames.map(series => {
      return <MenuItem value={series}>{series}</MenuItem>
    });
    return menuItems;
  }

  // Creates the items seen in the compare series menu
  seriesMenuCompareItems = (seriesNames) => {
    let { chosenSeries } = this.state;

    const seriesNamesWithoutChosen = seriesNames.filter(site => site !== chosenSeries);
    const menuItems = [<MenuItem value=""><em>None</em></MenuItem>].concat(seriesNamesWithoutChosen.map(series => {
      return <MenuItem value={series}>{series}</MenuItem>
    }));

    return menuItems;
  }

  render() {

    let { errorMode, unfinished, formattedJob, comparedJobsSite,
          comparedJobsSeries, siteNames, seriesNames, chosenSite,
          chosenSeries, chosenCompareSite, chosenCompareSeries, selectedJobs } = this.state;
    const { classes } = this.props;

    return (
      <div style={{ marginBottom:25+'px' }}>
        {errorMode ?
        'An error occurred. This is likely due to an error in job processing'
        :
        <div>
          <Paper style={{ marginTop:10+'px' }}>
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
                    {siteNames ?
                      this.siteMenuCompareItems(siteNames)
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
                    {seriesNames ?
                      this.seriesMenuCompareItems(seriesNames)
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
                TransitionComponent={Transition}
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
    );
  }
}

export default withStyles(styles)(AnalysisView);
