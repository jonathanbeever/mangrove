import React, { Component } from 'react';
import Tabs from './filteringTabs';
import axios from 'axios';

// TODO fix css
const inputFiles = [
  {
    inputId: '5c2547480af83b2bac5133f7',
    siteName: 'Zoo',
    setName: 'aci-zoo',
    fileName: 'zoo1.wav',
    location: [65.01, 40.45]
  },
  {
    inputId: '5c2547480bf83b2bac5133f7',
    siteName: 'Zoo',
    setName: 'aci-zoo',
    fileName: 'zoo2.wav',
    location: [65.01, 40.45]
  },
  {
    inputId: '5c2547480cf83b2bac5133f7',
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

class StepperTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFiltering: {
        siteName : '',
        setName : '',
        fileDate : '',
        latitude : '',
        longitude : ''
      },
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
      selectedInputs : [],
      selectedSpecs: {
        aci: [],
        ndsi: []
      }
    };
  }

  componentDidMount = () => {
    console.log(this.state.selectedSpecs)

    this.handleIndexChange('aci')
    // make indexed object of inputs
    var indexedFiles = {}
    var selected = []

    inputFiles.forEach(file => {
      selected.push(file.inputId)

      indexedFiles[file.inputId] = {
        fileName : file.fileName,
        location : file.location,
        setName : file.setName,
        siteName : file.siteName
      } 
    })

    this.setState({ selectedInputs : selected })

    this.setState({ indexedFiles : indexedFiles})
    // get all db specs
    axios.get('http://localhost:3000/specs')
      .then(res => {
        var specs = {
          'aci': [],
          'ndsi': []
        }

        res.data.forEach(spec => {
          var type = spec.type.substring(0, spec.type.indexOf('Spec'))
          specs[type].push(spec)
        })
        console.log(specs)
        // Set all specs state
        this.setState({ allSpecs: res.data })
        this.setState({ indexedSpecs: specs })
        // Set filtered specs with all initially
        // Choose specs of multiple indices?
        // this.setState({ filteredSpecs: res.data })
        this.setState({ filteredSpecs: specs })
      })

      axios.get('http://localhost:3000/jobs')
      .then(res => {
        // Set all specs state
        this.setState({ allJobs: res.data.jobs })
        this.setState({ jobsFiltered: res.data.jobs })
      })
  }

  // Input selection functions
  handleChange = name => e => {
    var inputFiltering = this.state.inputFiltering
    inputFiltering[name] = e.target.value
    
    this.setState({ inputFiltering: inputFiltering })
  };

  submitIndexFilter = () => {
    var filteredInputs = inputFiles.filter(file => {
      if(!this.state.inputFiltering.siteName || this.state.inputFiltering.siteName.toLowerCase() === file.siteName.toLowerCase()) {
        if(!this.state.inputFiltering.setName || this.state.inputFiltering.setName.toLowerCase() === file.setName.toLowerCase()) {
          if(!this.state.inputFiltering.latitude || Number(this.state.inputFiltering.latitude) === file.location[0]) {
            if(!this.state.inputFiltering.longitude || Number(this.state.inputFiltering.longitude) === file.location[1]) {
              return file;
            }
          }
        }
      }
    })

    this.setState({ filteredInputs: filteredInputs })

    var selected = filteredInputs.map(input => {
      return input.inputId
    })
    
    this.updateSelectedInputs(selected)
  }

  handleChipDelete = (label) => {
    label = label.split(' : ')

    var inputFiltering = this.state.inputFiltering
    inputFiltering[label[0]] = ''

    this.setState({ inputFiltering : inputFiltering })

    this.submitIndexFilter()
  }

  // Array of inputIds selected in table
  updateSelectedInputs = (selected) => {
    var filteredJobByInputs = []
    
    var check = 0

    var indices = ['aci', 'ndsi']
    indices.forEach(indx => {
      if(this.state.selectedSpecs[indx].length) {
        check++
      }
    })

    if(check !== 0) {
      this.state.allJobs.forEach(job => {
        // return jobs if id in array 'selected'
        // and spec id is in state selectedSpecs or no fitlering of specs has been done
        indices.forEach(indx => {
          if(this.state.selectedSpecs[indx].indexOf(job.spec) !== -1) {
            if(selected.indexOf(job.input) !== -1) {
              filteredJobByInputs.push(job)
            }
          }
        })
      })
    }
    else {
      this.state.allJobs.forEach(job => {
        // return jobs if id in array 'selected'
        // and spec id is in state selectedSpecs or no fitlering of specs has been done
        if(selected.indexOf(job.input) !== -1) {
          filteredJobByInputs.push(job)
        }
      })
    }
    console.log(filteredJobByInputs)
   
    // this.setState({ selectedSpecs: selectedSpecs })



    this.setState({ jobsFiltered: filteredJobByInputs })
    
    
    // Filter list of all jobs by list of selected inputs
    // var filteredJobByInput = this.state.allJobs.filter(job => {
    //   // return jobs if id in array 'selected'
    //   // and spec id is in state selectedSpecs or no fitlering of specs has been done
    //   if(selected.indexOf(job.input) !== -1 && ((!this.state.selectedSpecs.length) || (this.state.selectedSpecs.indexOf(job.specId) !== -1))) {
    //     return job
    //   }
    // })
    // Set state selectedInputs for filtering by specs
    this.setState({ selectedInputs: selected })
    // this.setState({ jobsFiltered: filteredJobByInput })
  }

  // TODO: filter by specs

  // Spec selection functions
  handleIndexChange = (e) => {
    var index = ''
    if(e.target) {
      this.setState({ index: e.target.value })
      index = e.target.value
    }
    else {
      this.setState({ index: e })
      index = e
    }
    switch (index) {
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

  handleSpecChange = name => e => {
    var tempState = this.state.specParamsByIndex

    if(name !== 'shannon')
      tempState[this.state.index][name] = e.target.value
    else
      tempState[this.state.index][name] = e.target.checked

    this.setState({ specParamsByIndex: tempState })
  }

  handleSpecSubmit = () => {
    console.log(this.state);
    
  }

  updateSelectedSpecs = (selected, index) => {
    var selectedSpecs = this.state.selectedSpecs
    selectedSpecs[index] = selected

    var filteredJobBySpecs = []

    this.state.allJobs.forEach(job => {
      // return jobs if id in array 'selected'
      // and spec id is in state selectedSpecs or no fitlering of specs has been done
      ['aci', 'ndsi'].forEach(indx => {
        if(selectedSpecs[indx].indexOf(job.spec) !== -1) {
          if(this.state.selectedInputs.indexOf(job.input) !== -1) {
            filteredJobBySpecs.push(job)
          }
        }
      })
  
    })
    this.setState({ selectedSpecs: selectedSpecs })
    this.setState({ jobsFiltered: filteredJobBySpecs })
  }


  // TODO; add author and creationtime to specs input
  // filter table
  // select specs ?
  // multiple filtering specification ?

  render() {
    return (
      <div className="container">
        <Tabs 
          // Input select props 
          inputFiltering = {this.state.inputFiltering}
          filteredInputs={this.state.filteredInputs}
          onDelete={this.handleChipDelete}
          onChange={this.handleChange} 
          onSubmitInput={this.submitIndexFilter}
          updateSelectedInputs={this.updateSelectedInputs} 
          // Specs select props
          // allSpecs={this.state.allSpecs}
          allSpecs={this.state.indexedSpecs}
          index={this.state.index}
          handleIndexChange={this.handleIndexChange}
          specParamsList={this.state.specParamsList}
          handleSpecChange={this.handleSpecChange}
          specParamsByIndex={this.state.specParamsByIndex}
          onSubmitSpecs={this.handleSpecSubmit}
          filteredSpecs={this.state.filteredSpecs}
          updateSelectedSpecs={this.updateSelectedSpecs}
          selectedSpecs={this.state.selectedSpecs}
          // Jobs select props
          filteredJobs={this.state.jobsFiltered}
          indexedFiles={this.state.indexedFiles}
          selectedInputs={this.state.selectedInputs}
        />
      </div>
    );
  }
}

export default StepperTest;