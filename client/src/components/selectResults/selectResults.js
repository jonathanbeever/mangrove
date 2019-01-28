import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FilterByIndex from './filterByIndex';
import SelectParamsByIndex from './selectParamsByIndex';
import FilteredJobs from './filteredJobs';
import SearchJobs from './searchJobs';
import AnalysisView from '../analysisView/analysisView';

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
    },
    {
      alias:'aci-default',
      minFreq: 'NA',
      maxFreq: 'NA',
      j: 5,
      fftW: 512
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
  ],
  bio: [
    {
      alias:'bio-one',
      minFreq: 2000,
      maxFreq: 8000,
      fftW: 512
    }
  ],
  adi: [
    {
      alias:'adi-one',
      maxFreq: 10000,
      dbThreshold: -50,
      freqStep: 1000,
      shannon: true
    }
  ],
  aei: [
    {
      alias:'aei-one',
      maxFreq: 10000,
      dbThreshold: -50,
      freqStep: 1000,
      shannon: true
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
      searchedValue: '',
      selectedJob: null,
      selectJobToCompare: null,
      hideFiltering: false
    };

    this.handleIndexChange = this.handleIndexChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.submitSearch = this.submitSearch.bind(this);
    this.toggleFiltering = this.toggleFiltering.bind(this);
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

  selectJob = job => e => {
    this.setState({ selectedJob : job })
    this.setState({ hideFiltering: true })
    this.setState({ selectedJobToCompare : null })
  }

  selectJobToCompare = job => e => {
    this.setState({ selectedJobToCompare : job })
  }

  toggleFiltering = () => {
    if(this.state.hideFiltering)
      this.setState({ hideFiltering: false })
    else
      this.setState({ hideFiltering: true })
  }

// Need 'x' in search bar
// Show all jobs w type of a checked index
// And checked params

  render() {
    return (
      <div className='col-12'>
        <Card>
          <CardContent>
            {this.state.hideFiltering === false ?
              <div>
                <h3>Filter Jobs</h3>
                {/*<p>View Result Visualizations-chaneg</p>              */}
                <div className='row'>
                  <div className='col-6'>
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
                  <div className='col-6'>
                    { this.state.selectedJob ?
                      <button onClick={this.toggleFiltering}>View Selected Job Results</button>
                      :
                      ''
                    }
                    <SearchJobs searchedValue={this.state.searchedValue} handleSearch={this.handleSearch} submitSearch={this.submitSearch}/>
                    <FilteredJobs results={this.state.filteredResults} selectJob={this.selectJob}/>
                  </div>
                </div>
              </div>
            :
              <div>
                <h3>Select</h3>
                {/*<p>View Result Visualizations-chaneg</p>*/}
                <div className='row'>
                  <div className='col-4'>
                    <div>
                      <button onClick={this.toggleFiltering}>Back to Filtering</button>
                      <FilteredJobs selectedJob={this.state.selectedJob} results={this.state.filteredResults} selectJob={this.selectJob} selectJobToCompare={this.selectJobToCompare}/>
                    </div>
                  </div>
                  <div className='col-8'>
                    <AnalysisView chosenResult={this.state.selectedJob} resultToCompare={this.state.selectedJobToCompare}/>
                  </div>
                </div>
              </div>
            }
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default SelectResults;
