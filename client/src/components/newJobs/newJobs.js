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
      selectedFiles: [],
      dialog: false
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

  handleInputUpload = (e) => {
    const url = 'http://localhost:3000/inputs';
    var files = e.target.files

    Array.from(files).forEach(file => {
      const form = new FormData();
      // Input this for all files or get from name on server?
      form.append('json', '{ "site": "UCF Arboretum", "series": "Hurricane Irma", "recordTimeMs": 1505016000000, "coords": { "lat": 28.596238, "long": -81.191381 } }')
      form.append('file', file)
  
      axios.put(url, form)
      .then(res => {
        this.listDbFiles(res.data)
      }).catch(err => {
        console.log(err)
      });
    });
  }

  closeDialog = () => {
    this.setState({ dialog: false })
    this.setState({ selectedSpec: [] })
    this.setState({ selectedFiles: [] })
    this.setState({ submitDisabled: false })
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
        />
        {this.state.dialog.length ? this.state.dialog : ''}
      </div>
    );
  }
}

export default NewJobs;
