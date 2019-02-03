import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputsTable from '../selectResults/inputs/inputsTable';
import Paper from '@material-ui/core/Paper';
import FileTabs from './fullWidthTabs';

const styles = theme => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing.unit 
  },
  formControl: {
    paddingTop: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  }
});

class ChooseFiles extends React.Component {
  state = {
    allFiles: this.props.allFiles
  };

  handleChange = e => {
  
  };

  componentDidMount = () => {
  }

  componentDidUpdate(prevProps) {
    if(this.state.allFiles !== this.props.allFiles) {
      this.renderTable()
    }
  }

  renderTable = () => {
    this.setState({allFiles: this.props.allFiles})
  }


  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className="col-12">
          <FileTabs 
            updateSelectedInputs={this.props.updateSelectedInputs} 
            filteredInputs={this.state.allFiles} 
            selected={this.props.selectedFiles}    
            onChange={this.props.handleInputUpload}  
            classes={classes}
            searchInputs={this.props.searchInputs}
            site={this.props.site}
            series={this.props.series}
            lat={this.props.lat}
            long={this.props.long}
            submitInputFilter={this.props.submitInputFilter}
            addFilesToUpload={this.props.addFilesToUpload}
            filesToUpload={this.props.filesToUpload}
            updateSelectedUploads={this.props.updateSelectedUploads} 
            selectedToEdit={this.props.selectedToEdit} 
            updateInputProperties={this.props.updateInputProperties}
            submitInputProperties={this.props.submitInputProperties}
            upload={this.props.upload}
            uploadFiles={this.props.uploadFiles}
          />
        </div>
      </div>
    );
  }
}

ChooseFiles.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChooseFiles);