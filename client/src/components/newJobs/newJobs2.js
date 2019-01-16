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
      selectedSpec: []
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
  }

  changeIndex = (value) => {
    console.log('is this called on click same spec?')
    // Clear specParamsByIndex for current index
    this.setState({ index: value })
  }

  handleSpecChange = name => e => {
    var tempState = this.state.specParamsByIndex

    if(name !== 'shannon')
      tempState[this.state.index][name] = parseInt(e.target.value)
    else
      tempState[this.state.index][name] = e.target.checked

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
      console.log(newParams)
    }
  }

  submitJob = () => {
    console.log('hi')
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
            // Add a document with this id to inputs collection until input api req is set up
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
      console.log(body)
      axios.put(
        "http://localhost:3000/specs",  
        body,
        {headers: {"Content-Type": "application/json"}}
      )
      .then(res => {
        console.log(res)
        var specId = ''
          // If new spec was create set id
        if(res.status === 201) 
          specId = res.data.specId
        // Spec already exists, save id
        else if(res.status === 200) 
          specId = res.data.specId
        // Loop through inputs and make requests
        inputs.forEach(inputId => {
          console.log(this.state.selectedIndex)
          // Request to queue new job
          axios.put(
            "http://localhost:3000/jobs",  
            {
              type: this.state.index,
              // Add a document with this id to inputs collection until input api req is set up
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

  render() {
    return (
      // Make this do stuff
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
        />
      </div>
    );
  }
}

export default NewJobs;
