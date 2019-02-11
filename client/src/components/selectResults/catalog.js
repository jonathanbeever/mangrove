import React, { Component } from 'react';
import Tabs from './components/tabs';
import axios from 'axios';
var _ = require('lodash');

class Catalog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFiltering: {
        site : '',
        series : '',
        fileDate : '',
        lat : '',
        long : ''
      },
      filteredInputs : [],
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
      selectedInputs : [],
      selectedSpecs: {
        aci: [],
        ndsi: [],
        adi: [],
        aei: [],
        bi: [],
        rms: []
      },
      filteredSpecs: {
        aci: [],
        ndsi: [],
        adi: [],
        aei: [],
        bi: [],
        rms: []
      },
      selectedIndex: '',
      specParamsList: [['minFreq', 'Min Frequency'], ['maxFreq', 'Max Frequency'], ['j', 'J'], ['fftW', 'fft-W']],
      jobFiltering: {
        author: ''
      },
      selectedJobs: [],
      showAnalysis: false,
      matchingInputIds: []
    };
  }

  componentDidMount = () => {
    this.handleIndexChange('aci')
    // make indexed object of inputs
    var selected = []

    this.setState({ selectedInputs : selected })

    // get all db specs
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
        var indexedSpecs = {}
        res.data.specs.forEach(spec => {
          specs[spec.type].push(spec)
          indexedSpecs[spec.specId] = spec
        })
        this.setState({ indexedSpecsById: indexedSpecs })
        // Set all specs state
        this.setState({ allSpecs: res.data.specs })
        this.setState({ indexedSpecs: specs })
        // Set filtered specs with all initially
        this.setState({ filteredSpecs: specs })
      })

      var indexedFiles = {}

      axios.get('http://localhost:3000/inputs')
      .then(res => {
        var inputs = res.data.inputs.map(input => {
          var path = input.path.split('\\')
          input.path = path[path.length - 1]
          return input
        })

        inputs.forEach(file => {
          // selected.push(file.inputId)
          indexedFiles[file.inputId] = file
        })

        this.setState({ indexedFiles : indexedFiles})
        this.setState({ allFiles: inputs })
      })

      axios.get('http://localhost:3000/jobs')
      .then(res => {
        // Set all specs state
        this.setState({ allJobs: res.data.jobs })
        // this.setState({ jobsFiltered: res.data.jobs })
        this.setState({ jobsFiltered: [] })
      })
  }

  // Input selection functions
  handleChange = name => e => {
    var inputFiltering = this.state.inputFiltering
    inputFiltering[name] = e.target.value

    this.setState({ inputFiltering: inputFiltering })
  };

  submitIndexFilter = () => {
    var filteredInputs = this.state.filteredInputs.filter(file => {
      var matchingFile = ''
      if(!this.state.inputFiltering.site || this.state.inputFiltering.site.toLowerCase() === file.site.toLowerCase()) {
        if(!this.state.inputFiltering.series || this.state.inputFiltering.series.toLowerCase() === file.series.toLowerCase()) {
          if(!this.state.inputFiltering.lat || Number(this.state.inputFiltering.lat) === file.coords.lat) {
            if(!this.state.inputFiltering.long || Number(this.state.inputFiltering.long) === file.coords.long) {
              matchingFile = file
            }
          }
        }
      }
      return matchingFile
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

    this.updateSelectedSpecs(this.state.selectedSpecs['aci'], 'aci')
  }

  // Array of inputIds selected in table
  updateSelectedInputs = (selected) => {
    const specs = this.state.selectedSpecs
    const indices = Object.keys(this.state.selectedSpecs)

    var filteredJobByInputs = []

    this.state.allJobs.forEach(job => {
      indices.forEach(index => {
        if(selected.indexOf(job.input) !== -1 && specs[index].indexOf(job.spec) !== -1) {
          filteredJobByInputs.push(job)
        }
      })
    })

    this.setState({ jobsFiltered: filteredJobByInputs })
    this.setState({ selectedInputs: selected })
  }

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
      default : {
        break;
      }
    }
  }

  handleSpecChange = name => e => {
    // chear otehr index filter when spec chnaged
    var tempState = this.state.specParamsByIndex

    if(name !== 'shannon')
      tempState[this.state.index][name] = e.target.value
    else
      tempState[this.state.index][name] = e.target.checked

    this.setState({ specParamsByIndex: tempState })
  }

  handleSpecSubmit = (index) => {
    var newSpecs = []
    var keys = Object.keys(this.state.specParamsByIndex[index])

    this.state.indexedSpecs[index].forEach(spec => {
      var check = 0;
      keys.forEach(key => {
        if(this.state.specParamsByIndex[index][key]) {
          if(parseInt(this.state.specParamsByIndex[index][key]) !== spec[key]) {
            check++
          }
        }
      })

      if(check === 0) {
        newSpecs.push(spec)
      }
    })

    var filteredSpecs = Object.assign([],this.state.filteredSpecs)
    filteredSpecs[index] = newSpecs

    this.setState({ filteredSpecs: filteredSpecs })
  }

  updateSelectedSpecs = (selected, index) => {
    var specs = this.state.selectedSpecs
    specs[index] = selected
    this.setState({ selectedSpecs: specs})

    var obj = {}
    if(selected.length)
      var inputs = this.state.matchingInputIds

    var indices = ['aci', 'ndsi', 'adi', 'aei', 'bi', 'rms']
    indices.forEach(index => {
      specs[index].forEach(specId => {
        obj[specId] = this.state.allJobs.map(job => {
          if(job.spec === specId)
            return job.input
          else
            return null
        }).filter(id => {
          if(id !== null)
            return id
        })
      })
    })

    var specIds = Object.keys(obj)

    if(specIds.length) {
      var startIndx = ''
      if(specIds.length > 1) {
        if(!inputs.length) {
          obj[specIds[0]].forEach(input => {
            inputs.push(input)
          })
          startIndx = 1
        }
        else
          startIndx = 0

        const all = inputs.slice(0)

        all.forEach(input => {
          for(var i = startIndx; i < specIds.length; i++) {
            if(obj[specIds[i]].indexOf(input) === -1 && inputs.indexOf(input) !== -1) {
              inputs.splice(inputs.indexOf(input), 1)
            }
          }
        })
      }
      // One spec selected
      else {
        inputs = obj[specIds[0]]
      }
    }
    // No specs selected
    else {
      inputs = []
      this.setState({ matchingInputIds: [] })
    }

    this.setState({ matchingInputIds: inputs })

    if(inputs.length > 1) {
      var matchingInputs = inputs.map(input => {
        return this.state.indexedFiles[input]
      })
    }
    else if(inputs.length === 1) {
      matchingInputs = [this.state.indexedFiles[inputs[0]]]
    }
    else {
      matchingInputs = []
    }
    this.setState({ filteredInputs: matchingInputs})

    if(this.state.selectedInputs.length) {

      var selectedInputs = this.state.selectedInputs.filter(inputId => {
        if(inputs.indexOf(inputId) !== -1)
          return inputId
      })
      this.setState({ selectedInputs: selectedInputs })
      this.updateSelectedInputs(selectedInputs)
    }
    this.setState({ selectedInputs: [] })
    this.setState({ selectedJobs: [] })
  }

  updateSelectedJobs = (selected) => {
    this.setState({ selectedJobs: selected })
    var jobs = _.cloneDeep(this.state.jobsFiltered)
    var jobsObj = {
      'aci': {},
      'ndsi': {},
      'adi': {},
      'aei': {},
      'bi': {},
      'rms': {}
    }

    jobs.forEach(job => {
      // If curr job is selected
      job.input = this.state.indexedFiles[job.input]
      if(selected.indexOf(job.jobId) !== -1) {
        var jobSpecsByIndex = Object.keys(jobsObj[job.type])
        if(jobSpecsByIndex.length) {
          // if spec is already a property
          if(jobSpecsByIndex.indexOf(job.spec) !== -1) {
            jobsObj[job.type][job.spec].push(job)
          }
          // Add spec as property and set job in array
          else {
            jobsObj[job.type][job.spec] = [job]
          }
        }
        else {
          jobsObj[job.type][job.spec] = [job]
        }
      }
    })
    this.setState({ selectedIndexedJobs: jobsObj })
  }

  deleteSpecChip = (label) => {
    label = label.split(' : ')
    var index = label[0]
    var param = label[1].split(' - ')

    var newSpecs = this.state.specParamsByIndex
    newSpecs[index][param[0]] = ''

    this.setState({ specParamsByIndex: newSpecs })
    this.handleSpecSubmit(index)
  }

  handleJobFilter = label => e => {
    var filter = this.state.jobFiltering
    filter[label] = e.target.value
    this.setState({ jobFiltering : filter })
  }

  handleSubmitJobFilter = () => {
    var filteredJobs = []
    this.state.allJobs.forEach(job => {
      // TODO: multiple specs
      if(this.state.selectedSpecs[this.state.selectedIndex].indexOf(job.spec) !== -1) {
        if(this.state.selectedInputs.indexOf(job.input) !== -1) {
          if(!this.state.jobFiltering.author || this.state.jobFiltering.author === job.author) {
            filteredJobs.push(job)
          }
        }
      }
    })

    this.setState({ jobsFiltered: filteredJobs })
  }

  sendJobs = () => {
    this.setState({ showAnalysis: true })
  }

  showFiltering = () => {
    this.setState({ showAnalysis: false })
  }

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
          deleteSpecChip={this.deleteSpecChip}
          // Jobs select props
          filteredJobs={this.state.jobsFiltered}
          indexedFiles={this.state.indexedFiles}
          selectedInputs={this.state.selectedInputs}
          updateSelectedJobs={this.updateSelectedJobs}
          selectedJobs={this.state.selectedJobs}
          selectedIndexedJobs={this.state.selectedIndexedJobs}
          sendJobs={this.sendJobs}
          handleJobFilter={this.handleJobFilter}
          jobFiltering={this.state.jobFiltering}
          submitJobFilter={this.handleSubmitJobFilter}
          selectedIndex={this.state.selectedIndex}
          indexedSpecs={this.state.indexedSpecsById}
          // Tabs props
          showAnalysis={this.state.showAnalysis}
          showFiltering={this.showFiltering}
        />
      </div>
    );
  }
}

export default Catalog;
