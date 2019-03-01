import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FileTabs from './fullWidthTabs';
import axios from 'axios';
import LinearIntermediate from './linearIntermediate';

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
    site: '',
    series: '',
    lat: '',
    long: '',
    filesToUpload: [],
    selectedToEdit: [],
    upload: {
      site: '',
      series: '',
      lat: '',
      long: ''
    }
  };

  componentDidMount = () => {
    axios.get('http://localhost:3000/inputs')
    .then(res => {
      res.data.inputs.map(input => {
        var path = input.path.split('\\')
        input.path = path[path.length - 1]
        return input
      })
      this.setState({ allFiles: res.data.inputs })
      this.setState({ filteredInputs: res.data.inputs })
    })
  }

  // Format path for new files uploaded and push to 
  listDbFiles = (resp) => {
    var allFiles = this.state.allFiles

    resp.forEach(file => {
      if(allFiles.indexOf(file.data) === -1) {
        var path = file.data.path.split('\\')
        file.data.path = path[path.length - 1]
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
          recordTimeMs: file.lastModified
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
      const form = new FormData();

      form.append('json', JSON.stringify(files[fileName].json))
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
  
  submitInputFilter = () => {
    var filteredInputs = this.state.allFiles.filter(file => {
      var matchingFile = ''
      if(!this.state.site || this.state.site.toLowerCase() === file.site.toLowerCase()) {
        if(!this.state.series || this.state.series.toLowerCase() === file.series.toLowerCase()) {
          if(!this.state.lat || Number(this.state.lat) === file.coords.lat) {
            if(!this.state.long || Number(this.state.long) === file.coords.long) {
              matchingFile = file
            }
          }
        }
      }
      return matchingFile
    })
    this.setState({ filteredInputs: filteredInputs })
  }

  searchInputs = name => e => {
    this.setState({ [name] : e.target.value })
  }

  updateInputProperties = name => e => {
    var upload = this.state.upload
    upload[name] = e.target.value

    this.setState({ upload: upload })
  }

  updateSelectedUploads = (selected) => {
    console.log(selected)
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
            // classes={classes}
            searchInputs={this.searchInputs}
            site={this.state.site}
            series={this.state.series}
            lat={this.state.lat}
            long={this.state.long}
            submitInputFilter={this.submitInputFilter}
            addFilesToUpload={this.addFilesToUpload}
            filesToUpload={this.state.filesToUpload}
            updateSelectedUploads={this.updateSelectedUploads} 
            selectedToEdit={this.state.selectedToEdit} 
            updateInputProperties={this.updateInputProperties}
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