import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FileTabs from './fullWidthTabs';
import axios from 'axios';
import LinearIntermediate from './linearIntermediate';
import moment from 'moment';
var _ = require('lodash');

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
    allFiles: [],
    newFiles: [],
    filteredInputs: [],
    selectedFiles: [],
    filter: {
      site: '',
      series: '',
      lat: '',
      long: '',
      recordTimeMs: {
        date: '',
        time: ''
      }
    },
    filesToUpload: [],
    selectedToEdit: [],
    upload: {
      site: '',
      series: '',
      lat: '',
      long: '',
      recordTimeMs: {
        date: '',
        time: ''
      }
    }
  };

  componentDidMount = () => {
    axios.get('http://localhost:3000/inputs')
    .then(res => {
      this.setState({ allFiles: res.data.inputs })
      this.setState({ filteredInputs: res.data.inputs })
    })
  }

  // Format path for new files uploaded and push to 
  listDbFiles = (resp) => {
    var allFiles = this.state.allFiles

    resp.forEach(file => {
      if(allFiles.indexOf(file.data) === -1) {
        allFiles.push(file.data)
      }
    })
    this.setState({ allFiles: allFiles })
  }

  addFilesToUpload = (e) => {
    var fileInfo = this.state.filesToUpload
    var files = e.target.files

    Array.from(files).forEach(file => {
      fileInfo[file.name] = {
        json: {
          site: '',
          series: '',
          coords: {
            lat: '',
            long: ''
          },
          recordTimeMs: ['', '']
        },
        file: file
      }
    });
    this.setState({ filesToUpload: fileInfo })
  }

  submitInputProperties = () => {
    var fileInfo = this.state.filesToUpload

    this.state.selectedToEdit.forEach(file => {
      if(this.state.upload.site.length)
        fileInfo[file].json.site = this.state.upload.site
      if(this.state.upload.series.length)
        fileInfo[file].json.series = this.state.upload.series
      if(this.state.upload.lat.length)
        fileInfo[file].json.coords.lat = parseInt(this.state.upload.lat)
      if(this.state.upload.long.length)
        fileInfo[file].json.coords.long = parseInt(this.state.upload.long)
      if(this.state.upload.recordTimeMs.date.length)
        fileInfo[file].json.recordTimeMs[0] = this.state.upload.recordTimeMs.date
      if(this.state.upload.recordTimeMs.time.length)
        fileInfo[file].json.recordTimeMs[1] = this.state.upload.recordTimeMs.time
    })
    this.setState({ filesToUpload: fileInfo })
  }

  uploadFiles = () => {
    this.props.openDialog(<div><LinearIntermediate /></div>)

    var fileNames = Object.keys(this.state.filesToUpload)
    var files = this.state.filesToUpload
    var uploadRequests = []

    const url = 'http://localhost:3000/inputs';

    fileNames.forEach(fileName => {
      var file = _.cloneDeep(files[fileName].json)
      file.recordTimeMs = new Date(file.recordTimeMs[0]+'T'+file.recordTimeMs[1]+':00').getTime()

      const form = new FormData();

      form.append('json', JSON.stringify(file))
      form.append('file', files[fileName].file)
  
      uploadRequests.push(axios.put(url, form))
    })

    Promise.all(uploadRequests)
    .then(responses => {
      this.listDbFiles(responses)
      this.props.openDialog(responses.length + ' files successfully added')
    }).catch(err => {
      this.props.openDialog(err.message + '. Please make sure to add a site and series name to all files.')
    })
  }
  
  // add filter by datetime
  submitInputFilter = () => {
    var filteredInputs = this.state.allFiles.filter(file => {
      var matchingFile = ''
      if(!this.state.filter.site || this.state.filter.site.toLowerCase() === file.site.toLowerCase()) {
        if(!this.state.filter.series || this.state.filter.series.toLowerCase() === file.series.toLowerCase()) {
          if(!this.state.filter.lat || Number(this.state.filter.lat) === file.coords.lat) {
            if(!this.state.filter.long || Number(this.state.filter.long) === file.coords.long) {
              matchingFile = file
            }
          }
        }
      }
      return matchingFile
    })
    this.setState({ filteredInputs: filteredInputs })
  }

  updateInputProperties = (name, value) => e => {
    var properties = this.state[value]

    if(name === 'date' || name === 'time')
      properties['recordTimeMs'][name] = e.target.value
    else
      properties[name] = e.target.value

    this.setState({ [value]: properties })
  }

  updateSelectedUploads = (selected) => {
    this.setState({ selectedToEdit: selected })
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className="col-12">
        {this.state.filteredInputs ? 
          <FileTabs 
            updateSelectedInputs={this.props.updateSelectedInputs} 
            filteredInputs={this.state.filteredInputs}
            selected={this.props.selectedFiles}    
            onChange={this.handleInputUpload}  
            filter={this.state.filter}
            submitInputFilter={this.submitInputFilter}
            addFilesToUpload={this.addFilesToUpload}
            filesToUpload={this.state.filesToUpload}
            updateSelectedUploads={this.updateSelectedUploads} 
            selectedToEdit={this.state.selectedToEdit} 
            updateProperties={this.updateInputProperties}
            submitInputProperties={this.submitInputProperties}
            upload={this.state.upload}
            uploadFiles={this.uploadFiles}
          /> : ''}
        </div>
      </div>
    );
  }
}

ChooseFiles.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChooseFiles);