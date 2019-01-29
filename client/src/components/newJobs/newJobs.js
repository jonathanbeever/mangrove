import React, { Component } from 'react';
import './newJobs.css';
import Stepper from './stepper';
import axios from 'axios';
import { POINT_CONVERSION_HYBRID } from 'constants';

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
      selectedFiles: []
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

    var inputs= ["5c3cbd27c012052a3c2d1099", "5c3cbd27c012052a3c2d1999", "5c3cbd27c012052a3c2d9999", "5c3cbd27c012052a3c299999"]

    // Spec already exists
    if(this.state.selectedSpec.length) {
      inputs.forEach(inputId => {
        console.log(inputId, this.state.selectedSpec[0], this.state.index)
        // Request to queue new job
        axios.put(
          "http://localhost:3000/jobs",  
          {
            type: this.state.index,
            inputId: inputId,
            specId: this.state.selectedSpec[0]
          },
          {headers: {"Content-Type": "application/json"}}
        )
        .then(res => {
          if(res.status === 201)
            alert('Job queued')
          else if(res.status === 200)
            alert('Job already created')
        })
        .catch(err => console.log(err.message));
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
            if(res.status === 201)
              alert('Job queued')
            else if(res.status === 200)
              alert('Job already created')
          })
          .catch(err => console.log(err.message));
        })
      })
    }
  }

  listDbFiles = (file) => {
    var newFiles = this.state.newFiles
    var allFiles = this.state.allFiles

    newFiles.push(file)
    if(allFiles.indexOf(file) === -1)
      allFiles.push(file)

    this.setState({ newFiles: newFiles })
    this.setState({ allFiles: allFiles })
  }

  updateSelectedFiles = (selected) => {
    console.log(selected)
    this.setState({ selectedFiles: selected })
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
          listDbFiles={this.listDbFiles}
          newFiles={this.state.newFiles}
          allFiles={this.state.allFiles}
          selectedFiles={this.state.selectedFiles}
          updateSelectedFiles={this.updateSelectedFiles}
        />
      </div>
    );
  }
}

export default NewJobs;
