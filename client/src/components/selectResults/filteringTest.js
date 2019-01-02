import React, { Component } from 'react';
import Tabs from './filteringTabs';
import axios from 'axios';

// TODO fix css
const inputFiles = [
  {
    inputId: '1',
    siteName: 'Zoo',
    setName: 'aci-zoo',
    fileName: 'zoo1.wav',
    location: [65.01, 40.45]
  },
  {
    inputId: '2',
    siteName: 'Zoo',
    setName: 'aci-zoo',
    fileName: 'zoo2.wav',
    location: [65.01, 40.45]
  },
  {
    inputId: '3',
    siteName: 'Zoo',
    setName: 'aci-zoo',
    fileName: 'zoo1.wav',
    location: [67.01, 40.45]
  },
  {
    inputId: '4',
    siteName: 'Zoo',
    setName: 'aci-zoo',
    fileName: 'zoo2.wav',
    location: [67.01, 40.45]
  },
  {
    inputId: '5',
    siteName: 'UCF',
    setName: 'aci-ucf',
    fileName: 'ucf1.wav',
    location: [65.71, 40.25]
  },
  {
    inputId: '6',
    siteName: 'UCF',
    setName: 'aci-ucf',
    fileName: 'ucf2.wav',
    location: [65.71, 40.25]
  }
]

class StepperTest
 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteName : '',
      setName : '',
      fileDate : '',
      latitude : '',
      longitude : '',
      filteredInputs : inputFiles,
      index: '',
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
          shannon: ''
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
        }
      }
      
    };

  }

  componentDidMount = () => {
    // get all inputs
    console.log(this.state.filteredInputs)
    // get all db specs
    axios.get('http://localhost:3000/specs')
      .then(res => {
        console.log(res.data)
        this.setState({ allSpecs: res.data })
      })
  }

  // Input selection functions
  handleChange = name => e => {
    console.log(name, e.target.value, this.state[name])
    this.setState({
      [name]: e.target.value,
    });
  };

  submitIndexFilter = () => {
    var filteredInputs = inputFiles.filter(file => {
      if(!this.state.siteName || this.state.siteName.toLowerCase() === file.siteName.toLowerCase()) {
        if(!this.state.setName || this.state.setName.toLowerCase() === file.setName.toLowerCase()) {
          if(!this.state.latitude || Number(this.state.latitude) === file.location[0]) {
            if(!this.state.longitude || Number(this.state.longitude) === file.location[1]) {
              return file;
            }
          }
        }
      }
    })

    this.setState({ filteredInputs: filteredInputs })
  }
  // Array of inputIds selected in table
  updateSelectedInputs = (selected) => {
    console.log(selected)
  }

  // Spec selection functions
  // TODO:
  // Handle index change
  handleIndexChange = (e) => {
    this.setState({ index: e.target.value })
    console.log(this.state.specParamsList)
    switch (e.target.value) {
      case 'aci': {
        // id and label of specs
        this.setState({ specParamsList: [['minFreq', 'Min Frequency'], ['maxFreq', 'Max Frequency'], ['j', 'J'], ['fftW', 'fft-W']] })
        break;
      }
      case 'ndsi': {
        this.setState({ specParamsList: [['anthroMin', 'Min Anthrophony'], ['anthroMax', 'Max Anthrophony'], ['bioMin', 'Min Biophony'], ['bioMax', 'Max Biophony'], ['fftW', 'fft-W']] })
        break;
      }
      case 'adi': {
        this.setState({ specParamsList: [['maxFreq', 'Max Frequency'], ['dbThreshold', 'db Threshold'], ['freqStep', 'Frequency Step'], ['shannon', 'Shannon']] })
        break;
      }
      case 'aei': {
        this.setState({ specParamsList: [['maxFreq', 'Max Frequency'], ['dbThreshold', 'db Threshold'], ['freqStep', 'Frequency Step']] })
        break;      
      }
      case 'bi': {
        this.setState({ specParamsList: [['minFreq', 'Min Frequency'], ['maxFreq', 'Max Frequency'], ['fftW', 'fft-W']] })
        break;      
      }
      case 'rms': {
        this.setState({ specParamsList: [['minFreq', 'Min Frequency'], ['maxFreq', 'Max Frequency'], ['j', 'J'], ['fftW', 'fft-W']] })
        break;      
      }
    }
  }
  // Handle spec change
  handleSpecChange = name => e => {
    var tempState = this.state.specParamsByIndex
    tempState[this.state.index][name] = e.target.value

    this.setState({ specParamsByIndex: tempState })
  }
  // Submit specs
  handleSpecSubmit = () => {
    console.log(this.state);
    
  }
  // Update selected specs

  render() {
    return (
      <div className="container">
        <Tabs 
          // Input select props 
          siteName={this.state.siteName} 
          setName={this.state.setName} 
          latitude={this.state.latitude}
          longitude={this.state.longitude}
          filteredInputs={this.state.filteredInputs}
          onChange={this.handleChange} 
          onSubmitInput={this.submitIndexFilter}
          updateSelectedInputs={this.updateSelectedInputs} 
          // Specs select props
          allSpecs={this.state.allSpecs}
          index={this.state.index}
          handleIndexChange={this.handleIndexChange}
          specParamsList={this.state.specParamsList}
          handleSpecChange={this.handleSpecChange}
          specParamsByIndex={this.state.specParamsByIndex}
          onSubmitSpecs={this.handleSpecSubmit}
        />
      </div>
    );
  }
}

export default StepperTest
;
