import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FilterByIndex from './filterByIndex';
import SelectParamsByIndex from './selectParamsByIndex';
import FilteredJobs from './filteredJobs';
import SearchJobs from './searchJobs'

const RESULTS = [
  {
    siteName: 'Zoo', 
    creationTime: 1546318800000, 
    type: 'ndsi', 
    input: 'zoo1.wav',
    spec: {
      alias: 'preset 2',
      anthroMin: 0,
      anthroMax: 1600,
      bioMin: 0,
      bioMax: 1000
    },
    status: 'finished'
  },
  {
    siteName: 'UCF Arboretum', 
    creationTime: 1546318800000, 
    type: 'aci', 
    input: 'zoo2.wav',
    spec: {
      alias: 'aci 1',
      minFreq: 0,
      maxFreq: 1600,
      j: 5,
      fftW: 10
    },
    status: 'finished'
  },
  {
    siteName: 'Zoo', 
    creationTime: 1546318800000, 
    type: 'adi', 
    input: 'zoo1.wav',
    spec: {
      alias: 'preset 2',
      anthroMin: 0,
      anthroMax: 1600,
      bioMin: 0,
      bioMax: 1000
    },
    status: 'finished'
  },
  {
    siteName: 'Site 1', 
    creationTime: 1546318800000, 
    type: 'aci', 
    input: 'zoo3.wav',
    spec: {
      alias: 'aci 1',
      minFreq: 0,
      maxFreq: 1600,
      j: 5,
      fftW: 10
    },
    status: 'finished'
  },
  {
    siteName: 'Site 1', 
    creationTime: 1546318800000, 
    type: 'ndsi', 
    input: 'zoo1.wav',
    spec: {
      alias: 'preset 2',
      anthroMin: 0,
      anthroMax: 1600,
      bioMin: 0,
      bioMax: 1000
    },
    status: 'finished'
  },
  {
    siteName: 'UCF Arboretum', 
    creationTime: 1546318800000, 
    type: 'aci', 
    input: 'zoo2.wav',
    spec: {
      alias: 'aci 5',
      minFreq: 0,
      maxFreq: 1600,
      j: 5,
      fftW: 10
    },
    status: 'finished'
  }
  // ,
  // {name: 'Zoo', date: '11/5/2018', index: ['NDSI', 'ACI'], params: 'Default'},
  // {name: 'Site1', date: '12/5/2018', index: ['ADI', 'ACI'], params: 'preset 1'},
  // {name: 'Site2', date: '10/5/2018', index: ['NDSI'], params: 'preset 3'},
  // {name: 'Site3', date: '9/5/2018', index: ['NDSI'], params: 'Default'},
  // {name: 'Site4', date: '8/5/2018', index: ['ADI'], params: 'Default'},
  // {name: 'Site5', date: '7/5/2018', index: ['ACI'], params: 'preset 3'},
  // {name: 'Site6', date: '6/5/2018', index: ['NDSI'], params: 'Default'},
  // {name: 'Site7', date: '5/5/2018', index: ['ACI'], params: 'preset 2'},
  // {name: 'Site8', date: '4/5/2018', index: ['NDSI'], params: 'preset 1'},
  // {name: 'Site9', date: '3/5/2018', index: ['NDSI'], params: 'Default'}
];

const presets = {
  aci: [
    {
      alias:'aci-one',
      minFreq: 0,
      maxFreq: 1000,
      j: 5,
      fftW: 20
    },
    {
      alias:'aci-two',
      minFreq: 30,
      maxFreq: 1500,
      j: 15,
      fftW: 30
    }
  ],
  ndsi: [
    {
      alias:'ndsi-one',
      minFreq: 0,
      maxFreq: 1000,
      j: 5,
      fftW: 20
    },
    {
      alias:'ndsi-two',
      minFreq: 30,
      maxFreq: 1500,
      j: 15,
      fftW: 30
    }
  ]
}

class SelectResults extends Component {
  
  constructor() {
    super();

    this.state = {
      filteredResults: RESULTS,
      checkedAci: true,
      checkedNdsi: true,
      checkedAdi: true,
      checkedEven: true,
      checkedBio: true,
      checkedRms: true,
      searchedValue: ''
    };

    this.handleIndexChange = this.handleIndexChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
  }

  // When an index is checked or unchecked from filtering section
  handleIndexChange = name => e => {
    // Set variable to value of filteredResults state
    var res = this.state.filteredResults
    // If the index was checked
    if(e.target.checked === true) {
      // Loop through all results
      RESULTS.forEach(job => {
        // If current job type equals the index checked
        if(job.type === e.target.value) {
          // If current job is not already selected
          // May not need now
          if(res.indexOf(job) === -1) {
            // Push to res
            res.push(job)
          }
        }
      })
    }
    // If index was unchecked
    else {
      // Set variable to filteredResults
      var newRes = []
      // Loop through filtered resutls
      res.forEach((job, index) => {
        // If current job equals index unchecked
        if(job.type !== e.target.value) {
          // Only push jobs to new array that are not the type of the unchecked index
          newRes.push(job)
        }
      })
      // Set filtered results to res
      this.setState({ filteredResults: newRes })
    }
    // Set state of checkbox value to event checked property
    this.setState({ [name]: e.target.checked })
  }

  handleSearch = (e) => {
    this.setState({ searchedValue: e.target.value })
    // Search with every letter or on submit??
  }

  submitSearch = () => {

    var newRes = [] 

    this.state.filteredResults.forEach(job => {
      if(job.siteName.toLowerCase().indexOf(this.state.searchedValue.toLowerCase()) !== -1) {
        newRes.push(job)
      }
    })
    this.setState({ filteredResults: newRes })
  }

// Need 'x' in search bar
// Show all jobs w type of a checked index
// And checked params

  render() {
    return (
      <div className='col-8'>
        <Card>
          <CardContent>
            <h4>Filter Jobs</h4>
            <p>View Result Visualizations</p>              
            <div className='row'>
              <div className='col-7'>
                <FilterByIndex 
                  checkedAci={this.state.checkedAci} 
                  checkedNdsi={this.state.checkedNdsi} 
                  checkedAdi={this.state.checkedAdi} 
                  checkedBio={this.state.checkedBio} 
                  checkedEven={this.state.checkedEven} 
                  checkedRms={this.state.checkedRms} 
                  onChange={this.handleIndexChange}
                />
                <SelectParamsByIndex 
                  aci={this.state.checkedAci} 
                  ndsi={this.state.checkedNdsi} 
                  adi={this.state.checkedAdi} 
                  bio={this.state.checkedBio} 
                  even={this.state.checkedEven} 
                  rms={this.state.checkedRms} 
                  // onChange={this.handleParamChange}
                  presets={presets}
                />
              </div>
              <div className='col-5'>
                <SearchJobs searchedValue={this.state.searchedValue} handleSearch={this.handleSearch} submitSearch={this.submitSearch}/>
                <FilteredJobs results={this.state.filteredResults}/>
              </div>
            </div>
          </CardContent>    
        </Card>
      </div>
    );
  }
}
  
export default SelectResults;