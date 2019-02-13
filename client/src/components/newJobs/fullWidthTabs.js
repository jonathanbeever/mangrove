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
    paddingBottom: theme.spacing.unit * 2
  },
  table: {
    paddingRight: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3
  },
  search: {
    paddingLeft: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3
  },
  label: {
    fontSize: '14px'
  },
  buttons: {
    paddingTop: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unti * 2,
  },
  buttonText: {
    fontSize: '9px'
  }
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
            <Tab label="Sound Files" className={classes.label} />
            <Tab label="Upload New Files" className={classes.label} />
          </Tabs>
          {this.state.value === 0 && <TabContainer dir={theme.direction}>
            <div className="row">
              <div className="col-3">
                <div className={classes.search}>
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
              </div>
              <div className="col-9">
                <div className={classes.table}>
                  <InputsTable
                    updateSelectedInputs={this.props.updateSelectedInputs} 
                    filteredInputs={this.props.filteredInputs} 
                    selected={this.props.selected}          
                  />
                </div>
              </div>
            </div>
          </TabContainer>}
          {this.state.value === 1 && <TabContainer >
            <div className="row">
              <div className="col-3">
                <div className={classes.search}>
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
                    <div >
                    <label htmlFor="selectFiles" className={classes.buttons}>
                      <Button variant="contained" component="span" color="primary" className={classes.buttonText}>
                        Choose New Files
                      </Button>
                    </label> 
                    <Button variant="contained" component="span" onClick={this.props.uploadFiles} className={classes.buttonText} >
                      Upload Files
                    </Button>
                    </div>
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
              </div>
              <div className="col-9">
                <div className={classes.table}>
                  <UploadsTable
                    filteredInputs={this.props.filesToUpload}
                    updateSelectedInputs={this.props.updateSelectedUploads} 
                    selected={this.props.selectedToEdit}          
                  />
                </div>
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