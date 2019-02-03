import React, { Component } from 'react';
import './newJobs.css';
import Stepper from './stepper';
import axios from 'axios';

class NewJobs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 'aci',
      specParamsByIndex : {
        aci: {
          minFreq: '',
          maxFreq: '',
          j: '',
          fftW: ''
        },
        ndsi: {
          anthroMin: '',
          anthroMax: '',
          bioMin: '',
          bioMax: '',
          fftW: ''
        },
        adi: {
          maxFreq: '',
          dbThreshold: '',
          freqStep: '',
          shannon: false
        },
        aei: {
          maxFreq: '',
          dbThreshold: '',
          freqStep: ''
        },
        bi: {
          minFreq: '',
          maxFreq: '',
          fftW: ''
        },
        rms: {
          test: ''
        }
      },
      selectedSpec: [],
      submitDisabled: false,
      allFiles: [],
      newFiles: [],
      filteredInputs: [],
      selectedFiles: [],
      dialog: false,
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
  }

  componentDidMount = () => {
    axios.get('http://localhost:3000/specs')
    .then(res => {
      var specs = {
        'aci': [],
        'ndsi': [],
        'adi': [],
        'aei': [],
        'bi': [],
        'rms': []
      }
      res.data.specs.forEach(spec => {
        specs[spec.type].push(spec)
      })
      // Set all specs state
      this.setState({ allSpecs: res.data.specs })
      this.setState({ indexedSpecs: specs })
    })

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

  changeIndex = (value) => {
    // Clear specParamsByIndex for current index
    this.setState({ index: value })
  }

  handleSpecChange = name => e => {
    var tempState = this.state.specParamsByIndex

    if(name !== 'shannon')
      tempState[this.state.index][name] = e.target.value
    else
      tempState[this.state.index][name] = e.target.checked

    var submitDisabled = false
    // update for shannon adi index
    Object.keys(tempState[this.state.index]).forEach(param => {
      if(!tempState[this.state.index][param].length) {
        submitDisabled = true
      }
    })
    this.setState({ submitDisabled: submitDisabled })
    this.setState({ specParamsByIndex: tempState })

    if(this.state.selectedSpec.length)
      this.setState({ selectedSpec: [] })
  }

  updateSelectedSpec = (selected) => {
    // A spec was checked
    this.setState({ selectedSpec : selected })
    if(selected.length) {
      var newParams = this.state.specParamsByIndex
      // Override or set specParamsByIndex
      Object.keys(this.state.specParamsByIndex[this.state.index]).forEach(param => {
        newParams[this.state.index][param] = ''
      })
      this.setState({ specParamsByIndex: newParams })
    }
  }

  submitJob = () => {

    var inputs = this.state.selectedFiles

    // Spec already exists
    if(this.state.selectedSpec.length) {
      this.state.selectedSpec.forEach(spec => {

        inputs.forEach(inputId => {
          // Request to queue new job
          axios.put(
            "http://localhost:3000/jobs",  
            {
              type: this.state.index,
              inputId: inputId,
              specId: spec
            },
            {headers: {"Content-Type": "application/json"}}
          )
          .then(res => {
            if(res.status === 201) {
              this.setState({message: 'Jobs Started. View progress in the job queue.'})
              this.setState({dialog: true})
            }
            else if(res.status === 200) {
              this.setState({message: 'This jobs has already been started. View progress in the job queue.'})
              this.setState({dialog: true})
            }
          })
          .catch(err => console.log(err.message));
        })
      })
    }
    else {
      // Create spec
      var body = this.state.specParamsByIndex[this.state.index]
      body.type = this.state.index

      axios.put(
        "http://localhost:3000/specs",  
        body,
        {headers: {"Content-Type": "application/json"}}
      )
      .then(res => {
        var specId = ''
          // If new spec was create set id
        if(res.status === 201) 
          specId = res.data.specId
        // Spec already exists, save id
        else if(res.status === 200) 
          specId = res.data.specId
        // Loop through inputs and make requests
        inputs.forEach(inputId => {
          // Request to queue new job
          axios.put(
            "http://localhost:3000/jobs",  
            {
              type: this.state.index,
              inputId: inputId,
              specId: specId
            },
            {headers: {"Content-Type": "application/json"}}
          )
          .then(res => {
            if(res.status === 201) {
              this.setState({message: 'Jobs Started. View progress in the job queue.'})
              this.setState({dialog: true})
            }
            else if(res.status === 200) {
              this.setState({message: 'This jobs has already been started. View progress in the job queue.'})
              this.setState({dialog: true})
            }
          })
          .catch(err => console.log(err.message));
        })
      })
    }
  }

  listDbFiles = (file) => {
    var allFiles = this.state.allFiles

    if(allFiles.indexOf(file) === -1) {
      var path = file.path.split('\\')
      file.path = path[path.length - 1]
      allFiles.push(file)
    }
    this.setState({ allFiles: allFiles })
  }

  updateSelectedFiles = (selected) => {
    this.setState({ selectedFiles: selected })
  }

  addFilesToUpload = (e) => {
    var fileInfo = this.state.filesToUpload
    var files = e.target.files
    console.log(files)
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
    console.log(fileInfo)
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
    const url = 'http://localhost:3000/inputs';
    var fileNames = Object.keys(this.state.filesToUpload)
    var files = this.state.filesToUpload

    fileNames.forEach(fileName => {
      const form = new FormData();

      form.append('json', JSON.stringify(files[fileName].json))
      form.append('file', files[fileName].file)
  
      axios.put(url, form)
      .then(res => {
        this.listDbFiles(res.data)
      }).catch(err => {
        // Validaton error
        // Alert required fields
        console.log(err.message)
      });
    });
  }

  closeDialog = () => {
    this.setState({ dialog: false })
    this.setState({ selectedSpec: [] })
    this.setState({ selectedFiles: [] })
    this.setState({ submitDisabled: false })
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
    return (
      <div>
        <Stepper 
          changeIndex={this.changeIndex}
          index={this.state.index}
          specParams={this.state.specParamsByIndex}
          onSpecChange={this.handleSpecChange}
          updateSelectedSpec={this.updateSelectedSpec}
          selectedSpec={this.state.selectedSpec}
          specs={this.state.indexedSpecs}
          submitJob={this.submitJob}
          submitDisabled={this.state.submitDisabled}
          allFiles={this.state.allFiles}
          selectedFiles={this.state.selectedFiles}
          updateSelectedFiles={this.updateSelectedFiles}
          handleInputUpload={this.handleInputUpload}
          dialog={this.state.dialog}
          message={this.state.message}
          closeDialog={this.closeDialog}
          filteredInputs={this.state.filteredInputs}
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
        />
        {this.state.dialog.length ? this.state.dialog : ''}
      </div>
    );
  }
}

export default NewJobs;
