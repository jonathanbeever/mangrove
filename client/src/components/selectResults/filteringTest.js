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
      index : ''
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
  handleInputChange = name => e => {
    console.log('hi')
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
  }
  // Handle spec change
  // Submit specs
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
          onChangeInput={this.handleInputChange} 
          onSubmitInput={this.submitIndexFilter}
          updateSelectedInputs={this.updateSelectedInputs} 
          // Specs select props
          allSpecs={this.state.allSpecs}
          index={this.state.index}
          handleIndexChange={this.handleIndexChange}
        />
      </div>
    );
  }
}

export default StepperTest
;
