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
import AutomateInputProperties from './automateInputProperties';

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
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2)
  },
  table: {
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  search: {
    paddingLeft: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  buttons: {
    textAlign: 'center'
  },
  button: {
    paddingLeft: theme.spacing(3),
    textAlign: 'center'
  }
});

class FullWidthTabs extends React.Component {
  state = {
    value: 0,
    filesToUpload: this.props.filesToUpload,
    modal: false
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  openModal = () => {this.setState({ modal: true })}

  closeModal = () => {this.setState({ modal: false })}

  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root} border={0}>
        <AppBar position="static" color="inherit">
          <Tabs
            TabIndicatorProps={{style: {backgroundColor: "#fdc907"}}}
            value={this.state.value}
            onChange={this.handleChange}
            variant="fullWidth"
          >
            <Tab 
              label="Sound Files"
              style={{ color: 'black', textDecoration: 'none', fontSize: '16px' }}
              activestyle={{ color: '#fdc907', textDecoration: 'none' }}
              className={classes.label} 
            />
            <Tab
              label="Upload New Files"
              style={{ color: 'black', textDecoration: 'none', fontSize: '16px' }}
              activestyle={{ color: '#fdc907', textDecoration: 'none' }}
              className={classes.label}
            />
          </Tabs>
          {this.state.value === 0 && <TabContainer dir={theme.direction}>
            <div className="row">
              <div className="col-3">
                <div className={classes.search}>
                  <SearchInputs 
                    onChange={this.props.updateProperties}
                    value='filter'
                    submitInputFilter={this.props.submitInputFilter}
                    site={this.props.site}
                    series={this.props.series}
                    lat={this.props.filter.lat}
                    long={this.props.filter.long}
                    date={this.props.filter.recordTimeMs.date}
                    time={this.props.filter.recordTimeMs.time}
                    message='Filter Input Files'
                  />
                </div>
                <div className={classes.button}>
                  <Button
                    disabled={!this.props.selected.length}
                    onClick={this.props.startRms}
                  >
                    Start RMS Jobs
                  </Button>
                </div>
              </div>
              <div className="col-9">
                <div className={classes.table}>
                  <InputsTable
                    updateSelectedInputs={this.props.updateSelectedInputs} 
                    filteredInputs={this.props.filteredInputs} 
                    selected={this.props.selected}
                    deleteInputs={this.props.promptConfirmDelete}
                  />
                </div>
              </div>
            </div>
          </TabContainer>}
          {this.state.value === 1 && <TabContainer dir={theme.direction}>
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
                  <div className={classes.buttons}>
                    <label htmlFor="selectFiles">
                      <Button component="span">
                        Choose New Files
                      </Button>
                    </label> 
                  </div>
                  {Object.keys(this.props.filesToUpload).length ?
                    <div className={classes.buttons}>
                      <Button component="span" onClick={this.openModal}>
                        Import Properties
                      </Button>
                    </div>
                    :
                    ''
                  }
                  {this.state.modal ? <AutomateInputProperties modal={this.state.modal} closeModal={this.closeModal} setNamingConvention={this.props.setNamingConvention}/> : ''}
                  <SearchInputs 
                    onChange={this.props.updateProperties}
                    value='upload'
                    submitInputFilter={this.props.submitInputProperties}
                    site={this.props.upload.site}
                    series={this.props.upload.series}
                    lat={this.props.upload.lat}
                    long={this.props.upload.long}
                    date={this.props.upload.recordTimeMs.date}
                    time={this.props.upload.recordTimeMs.time}
                    message='Update Selected Files'
                  />
                  <div className={classes.buttons} style={{marginBottom: 10}}>
                    <Button 
                      component="span" 
                      onClick={this.props.uploadFiles}
                      disabled={!Object.keys(this.props.filesToUpload).length}
                    >
                      Upload Files
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-9">
                <div className={classes.table}>
                  <UploadsTable
                    filteredInputs={this.props.filesToUpload}
                    updateSelectedInputs={this.props.updateSelectedUploads} 
                    selected={this.props.selectedToEdit}
                    deleteFromUploads={this.props.deleteFromUploads}    
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