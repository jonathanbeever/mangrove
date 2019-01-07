import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FilterInputs from './filterInputs';
import FilterSpecs from './filterSpecs';
import SelectJobs from './selectJobs'

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
    flexGrow: 1,
  },
});

class SimpleTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label={<div><h5>Inputs</h5></div>} />
            <Tab label={<div><h5>Specifications</h5></div>} />
            <Tab label={<div><h5>Jobs</h5></div>} />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer>
          <FilterInputs 
            // siteName={this.props.siteName} 
            // setName={this.props.setName} 
            // latitude={this.props.latitude}
            // longitude={this.props.longitude}
            inputFiltering={this.props.inputFiltering}
            onDelete={this.props.onDelete}
            filteredInputs={this.props.filteredInputs}
            onChange={this.props.onChange} 
            onSubmitInput={this.props.onSubmitInput} 
            updateSelectedInputs={this.props.updateSelectedInputs} 
            selected={this.props.selected}
          />
        </TabContainer>}
        {value === 1 && <TabContainer>
          <FilterSpecs 
            // allSpecs={this.props.allSpecs}
            index={this.props.index}
            handleIndexChange={this.props.handleIndexChange}
            specParamsList={this.props.specParamsList}
            handleSpecChange={this.props.handleSpecChange}
            specParamsByIndex={this.props.specParamsByIndex}
            onSubmitSpecs={this.props.onSubmitSpecs}
            filteredSpecs={this.props.filteredSpecs}
          />
        </TabContainer>}
        {value === 2 && <TabContainer>
          <SelectJobs 
            filteredJobs={this.props.filteredJobs}
            inputFiltering={this.props.inputFiltering}
            onDelete={this.props.onDelete}
            indexedFiles={this.props.indexedFiles}
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