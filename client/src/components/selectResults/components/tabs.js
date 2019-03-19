import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FilterInputs from '../inputs/filterInputs';
import FilterSpecs from '../specs/filterSpecs';
import SelectJobs from '../jobs/selectJobs';
import AnalysisView from '../../analysisView/analysisView';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 0 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  background: {
    backgroundColor: '#fafafa',
    color: '#031603',
    marginTop: 19,
    borderRadius: 2
  }
});

class SimpleTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
    if(this.props.showAnalysis === true && value !== 3)
      this.props.showFiltering()
  };

  changeTab = (value) => {
    this.setState({value: value})
    this.props.getData()
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if(prevProps.showAnalysis !== this.props.showAnalysis) {
      if(this.props.showAnalysis === true)
        this.setState({ value : 3 })
      else
        this.setState({ value: 0 })
    }
  }

  componentWillMount = () => {
    if(sessionStorage.getItem('catalogPageSave')) this.setState({value: 3});
  }

  componentWillUnmount = () => {
    if(this.state.value === 3) sessionStorage.setItem('catalogPageSave', 3);
    else sessionStorage.removeItem('catalogPageSave');
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    // console.log(this.props.selectedIndexedJobs);
    // console.log(this.props.selectedJobs);

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.background}>
          <Tabs value={value} onChange={this.handleChange} TabIndicatorProps={{style: {backgroundColor: "#212121"}}} centered>
            <Tab label={<div><h5>Specifications</h5></div>} />
            <Tab label={<div><h5>Inputs</h5></div>} />
            <Tab label={<div><h5>Jobs</h5></div>} />
            <Tab label={<div><h5>Analysis</h5></div>} disabled={!this.props.selectedJobs.length}/>
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer>
          <FilterSpecs
            index={this.props.index}
            handleIndexChange={this.props.handleIndexChange}
            specParamsList={this.props.specParamsList}
            handleSpecChange={this.props.handleSpecChange}
            specParamsByIndex={this.props.specParamsByIndex}
            onSubmitSpecs={this.props.onSubmitSpecs}
            filteredSpecs={this.props.filteredSpecs}
            updateSelectedSpecs={this.props.updateSelectedSpecs}
            selectedSpecs={this.props.selectedSpecs}
            onDelete={this.props.deleteSpecChip}
          />
        </TabContainer>}
        {value === 1 && <TabContainer>
          <FilterInputs
            changeTab={this.changeTab}
            filteredJobs={this.props.filteredJobs}
            inputFiltering={this.props.inputFiltering}
            onDelete={this.props.onDelete}
            filteredInputs={this.props.filteredInputs}
            onChange={this.props.onChange}
            onSubmitInput={this.props.onSubmitInput}
            updateSelectedInputs={this.props.updateSelectedInputs}
            selected={this.props.selectedInputs}
          />
        </TabContainer>}
        {value === 2 && <TabContainer>
          <SelectJobs
            filteredJobs={this.props.filteredJobs}
            // Input filtering
            indexedFiles={this.props.indexedFiles}
            inputFiltering={this.props.inputFiltering}
            onDelete={this.props.onDelete}
            // Spec Filtering
            selectedIndex={this.props.selectedIndex}
            selectedSpecs={this.props.selectedSpecs}
            filteredSpecs={this.props.filteredSpecs}
            indexedSpecsById={this.props.indexedSpecs}
            // Results for AnalysisView
            updateSelectedJobs={this.props.updateSelectedJobs}
            selectedJobs={this.props.selectedJobs}
            selectedIndexedJobs={this.props.selectedIndexedJobs}
            sendJobs={this.props.sendJobs}
            // Filtering jobs by author or date
            jobFiltering={this.props.jobFiltering}
            onChangeJobFilter={this.props.handleJobFilter}
            onSubmitFiltering={this.props.submitJobFilter}
          />
        </TabContainer>}
        {value === 3 && <TabContainer>
          <AnalysisView
            selectedJobs={this.props.selectedIndexedJobs}
            indexedSpecs={this.props.indexedSpecs}
          />
        </TabContainer>}
      </div>
    );
  }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTabs);
