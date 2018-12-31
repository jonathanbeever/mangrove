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
      filteredInputs : inputFiles
    };

  }

  componentDidMount = () => {
    console.log(this.state.filteredInputs)
    // axios.get('http://localhost:3000/jobs')
    //   .then(res => {
    //     console.log(res.data.jobs)
    //   })
  }

  // Todo: validation for date and number type on certian inputs
  handleInputChange = name => e => {
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

  render() {
    return (
      <div className="container-fluid">
        <Tabs 
          siteName={this.state.siteName} 
          setName={this.state.setName} 
          latitude={this.state.latitude}
          longitude={this.state.longitude}
          filteredInputs={this.state.filteredInputs}
          onChangeInput={this.handleInputChange} 
          onSubmitInput={this.submitIndexFilter}
          updateSelectedInputs={this.updateSelectedInputs} 
        />
      </div>
    );
  }
}

export default StepperTest
;
