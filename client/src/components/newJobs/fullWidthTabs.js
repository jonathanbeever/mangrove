import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import InputsTable from '../selectResults/inputs/inputsTable';
import UploadsTable from './uploadInputsTable';
import Button from '@material-ui/core/Button';
import SearchInputs from './searchInputs';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit
  },
});

class FullWidthTabs extends React.Component {
  state = {
    value: 0,
  };

  componentDidMount = () => {
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root} border={0}>
        <AppBar position="static" color="inherit">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Sound Files" />
            <Tab label="Upload New Files" />
          </Tabs>
          {this.state.value === 0 && <TabContainer dir={theme.direction}>
            <div className="row">
              <div className="col-3">
                <SearchInputs 
                  onChange={this.props.searchInputs} 
                  submitInputFilter={this.props.submitInputFilter}
                  site={this.props.site}
                  series={this.props.series}
                  lat={this.props.lat}
                  long={this.props.long}
                  message='Filter Input Files'
                />
              </div>
              <div className="col-9">
                <InputsTable
                  updateSelectedInputs={this.props.updateSelectedInputs} 
                  filteredInputs={this.props.filteredInputs} 
                  selected={this.props.selected}          
                />
              </div>
            </div>
          </TabContainer>}
          {this.state.value === 1 && <TabContainer >
            <div className="row">
              <div className="col-3">
                <input
                  accept="audio/wave"
                  className={this.props.classes.input}
                  style={{ display: 'none' }}
                  onChange={this.props.addFilesToUpload}
                  id="selectFiles"
                  multiple
                  type="file"
                />
                <div>
                  <label htmlFor="selectFiles"className={classes.root}>
                    <Button variant="contained" component="span" color="primary">
                      Choose New Files
                    </Button>
                  </label> 
                  <Button variant="contained" component="span" onClick={this.props.uploadFiles} >
                    Upload Files
                  </Button>
                </div>
                <SearchInputs 
                  onChange={this.props.updateInputProperties}
                  submitInputFilter={this.props.submitInputProperties}
                  site={this.props.upload.site}
                  series={this.props.upload.series}
                  lat={this.props.upload.lat}
                  long={this.props.upload.long}
                  message='Update Selected Files'
                />
              </div>
              <div className="col-9">
                <UploadsTable
                  filteredInputs={this.props.filesToUpload}
                  updateSelectedInputs={this.props.updateSelectedUploads} 
                  selected={this.props.selectedToEdit}          
                />
              </div>
            </div>
          </TabContainer>}
        </AppBar>
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(FullWidthTabs);