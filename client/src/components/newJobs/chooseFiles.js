import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FileTabs from './fullWidthTabs';
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';
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
    },
    progress: 0,
    showUploadProgress: false,
    progressBar: ''
  };

  componentDidMount = () => {
    axios.get('http://127.0.0.1:34251/inputs')
    .then(res => {
      this.setState({ allFiles: res.data.inputs })
      this.setState({ filteredInputs: res.data.inputs })
    })
  }

  componentDidUpdate = (prevProps) => {
    if(this.props.deletedFiles !== prevProps.deletedFiles) {
      var allFiles = this.state.allFiles.filter(file => {
        if(this.props.deletedFiles.indexOf(file.inputId) === -1)
          return file
      })
      var filteredInputs = this.state.filteredInputs.filter(file => {
        if(this.props.deletedFiles.indexOf(file.inputId) === -1)
          return file
      })
      this.setState({
        allFiles: allFiles,
        filteredInputs: filteredInputs
      })
    }
  }

  setNamingConvention = (value, separator) => {
    var order = value.split(',')
    var filesInfo = this.state.filesToUpload
    var files = Object.keys(filesInfo)

    files.forEach(file => {
      file = file.substring(0, file.length - 4)
      var fileSplit = file.split(separator)

      if(order.indexOf('DATE') !== -1)
        filesInfo[file+'.wav']['json'].recordTimeMs[0] = moment(fileSplit[order.indexOf('DATE')]).format('YYYY-MM-DD')
      if(order.indexOf('TIME') !== -1) {
        let time = fileSplit[order.indexOf('TIME')]
        time = time.substring(0, 2) + ':' + time.substring(2, 4) + ':' + time.substring(4, 6)
        filesInfo[file+'.wav']['json'].recordTimeMs[1] = time
      }
      if(order.indexOf('LAT') !== -1)
        filesInfo[file+'.wav']['json'].coords.lat = fileSplit[order.indexOf('LAT')]
      if(order.indexOf('LONG') !== -1)
        filesInfo[file+'.wav']['json'].coords.long = fileSplit[order.indexOf('LONG')]
      if(order.indexOf('SITE') !== -1)
        filesInfo[file+'.wav']['json'].site = fileSplit[order.indexOf('SITE')]
      if(order.indexOf('SERIES') !== -1)
        filesInfo[file+'.wav']['json'].series = fileSplit[order.indexOf('SERIES')]
    })
    this.setState({ filesToUpload: filesInfo })
  }

  listDbFiles = (resp) => {
    var allFiles = this.state.allFiles
    resp.forEach(file => {
      if(allFiles.indexOf(file.data) === -1) {
        allFiles.push(file.data)
      }
    })
    this.setState({ allFiles: allFiles, filteredInputs: allFiles })
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
        fileInfo[file].json.coords.lat = Number(this.state.upload.lat)
      if(this.state.upload.long.length)
        fileInfo[file].json.coords.long = Number(this.state.upload.long)
      if(this.state.upload.recordTimeMs.date.length)
        fileInfo[file].json.recordTimeMs[0] = this.state.upload.recordTimeMs.date
      if(this.state.upload.recordTimeMs.time.length)
        fileInfo[file].json.recordTimeMs[1] = this.state.upload.recordTimeMs.time
    })
    this.setState({ filesToUpload: fileInfo })
  }

  uploadFiles = () => {
    this.setState({
      showUploadProgress: true,
      progressBar: (<LinearProgress variant="determinate" value={this.state.progress} />)
    })

    var fileNames = Object.keys(this.state.filesToUpload)
    var files = this.state.filesToUpload
    var uploadRequests = []
    var responses = []
    var failed = []

    const url = 'http://127.0.0.1:34251/inputs';

    fileNames.forEach(fileName => {
      var file = _.cloneDeep(files[fileName].json)
      if(file.recordTimeMs[1].length === 5)
        file.recordTimeMs = new Date(file.recordTimeMs[0]+'T'+file.recordTimeMs[1]+':00').getTime()
      else if(file.recordTimeMs[1].length === 8)
        file.recordTimeMs = new Date(file.recordTimeMs[0]+'T'+file.recordTimeMs[1]).getTime()

      const form = new FormData();

      form.append('json', JSON.stringify(file))
      form.append('file', files[fileName].file)
      

      uploadRequests.push(
        axios.put(url, form)
        .then(response => {
          if(response.status === 201) {
            var progress = this.state.progress
            progress++

            this.setState({
              progressBar: (<LinearProgress variant="determinate" value={Math.ceil(progress/uploadRequests.length * 100)} />)
            })

            this.setState({progress: progress})
          } 
          responses.push(response)
        })
        .catch(function (error) {
          failed.push(error)
        })
      )
    })

    Promise.all(uploadRequests)
    .then(() => {
      var message = ''
      var clear = this.state.upload
      clear['site'] = clear['series'] = clear['lat'] = clear['long'] = clear['recordTimeMs']['date'] = clear['recordTimeMs']['time'] = ''
      
      if(responses.length) {

        if(responses.length > 1)
          message += responses.length + ' files successfully added. '
        else
          message += responses.length + ' file successfully added. '
      }
      if(failed.length) {
        if(failed.length > 1)
          message += 'Failed to upload ' + failed.length + ' files.'
        else
          message += 'Failed to upload ' + failed.length + ' file.'
      }
     
      this.props.openDialog(message)
      this.listDbFiles(responses)

      this.setState({
        showUploadProgress: false,
        filesToUpload: [],
        selectedToEdit: [],
        upload: clear
      })
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
        {this.state.showUploadProgress ?
          this.state.progressBar : ''
        }
        {this.state.filteredInputs ? 
          <div style={{marginTop: 5+'px'}}>
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
              setNamingConvention={this.setNamingConvention}
              startRms={this.props.startRms}
              promptConfirmDelete={this.props.promptConfirmDelete}
            />
          </div> : ''}
        </div>
      </div>
    );
  }
}

ChooseFiles.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChooseFiles);