import React, { Component } from 'react';
import './newJobs.css';
import Stepper from './stepper';

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
      }
    };
  }

  changeIndex = (value) => {
    this.setState({ index: value })
  }

  handleSpecChange = name => e => {
    var tempState = this.state.specParamsByIndex

    if(name !== 'shannon')
      tempState[this.state.index][name] = e.target.value
    else
      tempState[this.state.index][name] = e.target.checked

    this.setState({ specParamsByIndex: tempState })
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
        />
      </div>
    );
  }
}

export default NewJobs;
