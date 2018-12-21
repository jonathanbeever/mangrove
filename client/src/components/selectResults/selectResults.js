import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FilterByIndex from './filterByIndex';
import SelectParamsByIndex from './selectParamsByIndex';
import FilteredJobs from './filteredJobs';
import SearchJobs from './searchJobs';
import AnalysisView from '../analysisView/analysisView';

// db.Inputs.distinct('siteName')
const siteNames = [
  'Zoo',
  'UCF Arboretum'
]

// location left out for now
const inputs = [
  {
    _id: "10000",
    fileName: 'giraffes/file1.wav',
    siteName: 'Zoo',
    creationTime: 1546318800000
  },
  {
    _id: "10001",
    fileName: 'giraffes/file2.wav',
    siteName: 'Zoo',
    creationTime: 1546318800001
  },
  {
    _id: "10002",
    fileName: 'giraffes/file3.wav',
    siteName: 'Zoo',
    creationTime: 1546318800002
  },
  {
    _id: "10003",
    fileName: 'giraffes/file4.wav',
    siteName: 'Zoo',
    creationTime: 1546318800003
  },
  {
    _id: "10004",
    fileName: 'giraffes/file5.wav',
    siteName: 'Zoo',
    creationTime: 1546318800004
  },
  {
    _id: "10005",
    fileName: 'giraffes/file6.wav',
    siteName: 'Zoo',
    creationTime: 1546318800005
  },
  {
    _id: "10006",
    fileName: 'giraffes/file7.wav',
    siteName: 'Zoo',
    creationTime: 1546318800006
  },
  {
    _id: "10007",
    fileName: 'giraffes/file8.wav',
    siteName: 'Zoo',
    creationTime: 1546318800007
  },
  ,
  {
    _id: "10008",
    fileName: 'hurricane/file1.wav',
    siteName: 'UCF Arboretum',
    creationTime: 1546318800001
  },
  {
    _id: "10009",
    fileName: 'hurricane/file2.wav',
    siteName: 'UCF Arboretum',
    creationTime: 1546318800002
  },
  {
    _id: "10010",
    fileName: 'hurricane/file3.wav',
    siteName: 'UCF Arboretum',
    creationTime: 1546318800003
  },
]

// Returned from get all specs request
const specs = [
  {
    _id: "00001",
    alias: 'preset 2',
    metric: 'ndsi',
    anthroMin: 0,
    anthroMax: 1600,
    bioMin: 0,
    bioMax: 1000
  },
  {
    _id: "00002", 
    alias: 'aci_1',
    metric: "aci",
    minFreq: 0, 
    maxFreq: 16000, 
    j: 30, 
    fftW: 10
  },
  {
    _id: "00003", 
    alias: 'aci_2',
    metric: "aci",
    minFreq: 1000, 
    maxFreq: 16000, 
    j: 30, 
    fftW: 15
  },
  {
    _id: "00004", 
    alias: 'aci_3',
    metric: "aci",
    minFreq: 0, 
    maxFreq: 10000, 
    j: 20, 
    fftW: 10
  },
  {
    _id: "00005",
    alias: 'ndsi_2',
    metric: 'ndsi',
    anthroMin: 100,
    anthroMax: 1600,
    bioMin: 100,
    bioMax: 1000
  }
]

// ndsi specs : 00001, 00005
// aci specs: 00002 - 00004

// zoo: 10000 - 10007
// arboretum: 10008 - 10010
// Each index of jobs is the ObjectId
const jobs = [
  // 20000 - 20006 : aci, aci-1, all zoo files
  {
    _id: "20000",
    type: 'aci',
    input: "10000",
    spec: "00002",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20001",
    type: 'aci',
    input: "10002",
    spec: "00002",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20002",
    type: 'aci',
    input: "10004",
    spec: "00002",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20003",
    type: 'aci',
    input: "10005",
    spec: "00002",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20004",
    type: 'aci',
    input: "10003",
    spec: "00002",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20005",
    type: 'aci',
    input: "10006",
    spec: "00002",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20006",
    type: 'aci',
    input: "10007",
    spec: "00002",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  // 20007 - 20013 : aci, aci-3, all zoo files
  {
    _id: "20007",
    type: 'aci',
    input: "10000",
    spec: "00004",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20008",
    type: 'aci',
    input: "10002",
    spec: "00004",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20009",
    type: 'aci',
    input: "10004",
    spec: "00004",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20010",
    type: 'aci',
    input: "10005",
    spec: "00004",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20011",
    type: 'aci',
    input: "10003",
    spec: "00004",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20012",
    type: 'aci',
    input: "10006",
    spec: "00004",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20013",
    type: 'aci',
    input: "10007",
    spec: "00004",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  // 20014 - 20020 : aci, aci-2, all zoo files
  {
    _id: "20014",
    type: 'aci',
    input: "10000",
    spec: "00003",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20015",
    type: 'aci',
    input: "10003",
    spec: "00004",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20016",
    type: 'aci',
    input: "10004",
    spec: "00003",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20017",
    type: 'aci',
    input: "10005",
    spec: "00003",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20018",
    type: 'aci',
    input: "10003",
    spec: "00003",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20019",
    type: 'aci',
    input: "10006",
    spec: "00003",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20020",
    type: 'aci',
    input: "10007",
    spec: "00003",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  // 20021 - 20027 : ndsi, ndsi-2, all zoo files
  {
    _id: "20021",
    type: 'ndsi',
    input: "10000",
    spec: "00005",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20022",
    type: 'ndsi',
    input: "10002",
    spec: "00005",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20023",
    type: 'ndsi',
    input: "10004",
    spec: "00005",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20024",
    type: 'ndsi',
    input: "10005",
    spec: "00005",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20025",
    type: 'ndsi',
    input: "10003",
    spec: "00005",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20026",
    type: 'ndsi',
    input: "10006",
    spec: "00005",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20027",
    type: 'ndsi',
    input: "10007",
    spec: "00005",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  // 20021 - 20027 : ndsi, preset 2, all zoo files
  {
    _id: "20021",
    type: 'ndsi',
    input: "10000",
    spec: "00001",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20022",
    type: 'ndsi',
    input: "10002",
    spec: "00001",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20023",
    type: 'ndsi',
    input: "10004",
    spec: "00001",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20024",
    type: 'ndsi',
    input: "10005",
    spec: "00001",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20025",
    type: 'ndsi',
    input: "10003",
    spec: "00001",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20026",
    type: 'ndsi',
    input: "10006",
    spec: "00001",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20027",
    type: 'ndsi',
    input: "10007",
    spec: "00001",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },

  // 20028 - 20030 : aci, aci-1, all arboretum files
  {
    _id: "20028",
    type: 'aci',
    input: "10008",
    spec: "00002",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20029",
    type: 'aci',
    input: "10009",
    spec: "00002",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20030",
    type: 'aci',
    input: "10010",
    spec: "00002",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  
  // 20031 - 20033 : aci, aci-3, all zoo files
  {
    _id: "20031",
    type: 'aci',
    input: "10008",
    spec: "00004",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20032",
    type: 'aci',
    input: "10009",
    spec: "00004",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20033",
    type: 'aci',
    input: "10010",
    spec: "00004",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },

  // 20034 - 20036 : aci, aci-2, all zoo files
  {
    _id: "20034",
    type: 'aci',
    input: "10008",
    spec: "00003",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20035",
    type: 'aci',
    input: "10009",
    spec: "00004",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20036",
    type: 'aci',
    input: "10010",
    spec: "00003",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },

  // 20037 - 20039 : ndsi, ndsi-2, all zoo files
  {
    _id: "20037",
    type: 'ndsi',
    input: "10008",
    spec: "00005",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20038",
    type: 'ndsi',
    input: "10009",
    spec: "00005",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20039",
    type: 'ndsi',
    input: "10010",
    spec: "00005",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },

  // 20040 - 20042 : ndsi, preset 2, all zoo files
  {
    _id: "20040",
    type: 'ndsi',
    input: "10008",
    spec: "00001",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20041",
    type: 'ndsi',
    input: "10009",
    spec: "00001",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
  {
    _id: "20042",
    type: 'ndsi',
    input: "10010",
    spec: "00001",
    result: {

    },
    tags: ["giraffes", "zoo"],
    status: 'finished'
  },
]


class SelectResults extends Component {

  constructor() {
    super();

    this.state = {
      // filteredResults: RESULTS,
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
      // filteredPopResults: ''
    };

    // this.handleIndexChange = this.handleIndexChange.bind(this);
    // this.handleSearch = this.handleSearch.bind(this);
    // this.submitSearch = this.submitSearch.bind(this);
    // this.toggleFiltering = this.toggleFiltering.bind(this);
  }

  componentDidMount = () => {
    var inputsObject = {}

    inputs.forEach(input => {
      inputsObject[input._id] = input
    })

    var specsObject = {}

    specs.forEach(spec => {
      specsObject[spec._id] = spec
    })

    this.populateJobs(jobs, inputsObject, specsObject)
   
    this.setState({inputsObject: inputsObject})
    this.setState({specssObject: specsObject})

    // this.listBySiteName(jobsPopulated, 'Zoo')


  }

  // 
  populateJobs = (jobs, inputsObject, specsObject) => {
    console.log('populate')
    var jobsPopulated = []
    // Populate jobs with indexed spec and input arrays
    jobs.forEach(job => {
      let jobWithObject = job
      jobWithObject.input = inputsObject[job.input]
      jobWithObject.spec = specsObject[job.spec]
      jobsPopulated.push(jobWithObject)
    })

    this.setState({filteredResults: jobsPopulated})

    // Format jobs in nested array
    // ['Zoo': [
    //   'aci': [
    //     'preset-1': [job1, job2]
    //   ], 
    //   'ndsi': [
    //     'preset-2': [job3]]
    //   ]
    // ]
    var formatted = []
    
    jobsPopulated.forEach(job => {
      // Set each unique sitename as array key
      if(!formatted[job.input.siteName]) {
        // Add job to new array with spec alias as key
        let newSpec = []
        newSpec[job.spec.alias] = [job]
        // Add array of job to new array with index as key
        let newType = []
        newType[job.type] = newSpec
        // Add array with index and spec to formatted array with sitename as key
        formatted[job.input.siteName] = newType
      }
      else {
        // If sitename and type are already array keys
        if(formatted[job.input.siteName][job.type]) {
          // If current spec alias is a key
          if(formatted[job.input.siteName][job.type][job.spec.alias])
            // Push cirrent job
            formatted[job.input.siteName][job.type][job.spec.alias].push(job)
          else {
            // Else, set array of current job to array with key spec alias
            formatted[job.input.siteName][job.type][job.spec.alias] = [job]
          }
        }
        // If type is not a key of sitename array
        else {
          // Set job as new array
          var newSpec = []
          newSpec[job.spec.alias] = [job]
          // Set new array to sitename array with type index
          formatted[job.input.siteName][job.type] = newSpec
        }
      }
    })
    console.log(formatted)
    this.setState({allFormatted: formatted})
    this.setState({currentFormatted: formatted})

    // Format nested array to render 
    this.setHtmlFormatted(formatted)
  }

  setHtmlFormatted = jobs => {
    console.log(Object.keys(jobs))
    var html = Object.keys(jobs).map(site => {
      console.log(Object.keys(jobs[site]).length, 'len')
      return (
        <div>
          { Object.keys(jobs[site]).length ? 
            <h3>{site}</h3> : ''
          }
          { Object.keys(jobs[site]).map(index => {
            return (
              <div>
                <h4>{index}</h4>
                {Object.keys(jobs[site][index]).map(spec => {
                  return (
                    <div>
                      <h5>{spec}</h5>
                      {jobs[site][index][spec].map(file => {
                        return (
                          <div>{file.input.fileName}</div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )
    })
    console.log(html)
    this.setState({html: <div>{html}</div>})
  }

  // get all jobs by one sitename
  
  // listBySiteName = (jobs, name) => {
  //   const indices = ['aci', 'ndsi', 'adi', 'even', 'bio', 'rms']

  //   var jobBySiteName = jobs.filter(job => {
  //     return job.input.siteName === name ? job : ''
  //   })
  //   console.log(jobBySiteName)

  //   // var htmlJobsBySiteName = ({
  //   //   indices.map(index => {

  //   //   })
  //   // })
  // }




  // When an index is checked or unchecked from filtering section
  handleIndexChange = name => e => {
    console.log(this.state.allFormatted, this.state.currentFormatted)
    // Set variable to value of filteredResults state
    var res = []
    var newRes = []
    if(this.state.currentFormatted)
      res = this.state.currentFormatted
    // If the index was checked

    if(e.target.checked === true) {
      // Loop through all results
      console.log(this.state.allFormatted[0])
      Object.keys(this.state.allFormatted).forEach(site => {
        console.log(this.state.allFormatted[site])
        Object.keys(this.state.allFormatted[site]).forEach(index => {
          // If current job type equals the index checked
          if(index === e.target.value) {
            // If current job is not already selected
            console.log(index, e.target.value)
            if(!res[site][index]) {
              res[site][index] = this.state.allFormatted[site][index]
              // res.push(job)
            }
          }
        })
        
      })
      // console.log(res)
      this.setState({ currentFormatted: res })
      this.setHtmlFormatted(res)
    }
    // If index was unchecked
    else {

      console.log(res)

      // console.log(this.state.allFormatted[0])
      Object.keys(res).forEach(site => {
        newRes[site] = []
        // console.log(res[site][e.target.value])
        Object.keys(res[site]).forEach(index => {
          if(index !== e.target.value) {
            newRes[site][index] = res[site][index]
          }
        })
        // delete res[site][e.target.value]
        // console.log(res[site])
        // return res
      })
      console.log(newRes, res)

      this.setState({ currentFormatted: newRes })
      this.setHtmlFormatted(newRes)


      // // Set variable to filteredResults
      // var newRes = []
      // // Loop through filtered resutls
      // res.forEach((job, index) => {
      //   // If current job equals index unchecked
      //   if(job.type !== e.target.value) {
      //     // Only push jobs to new array that are not the type of the unchecked index
      //     newRes.push(job)
      //   }
      // })
      // Set filtered results to res
      // this.setState({ filteredPopResults: newRes })
    }

    // Set state of checkbox value to event checked property
    this.setState({ [name]: e.target.checked })
  }

  // handleSearch = (e) => {
  //   this.setState({ searchedValue: e.target.value })
  //   // Search with every letter or on submit??
  // }

  // submitSearch = () => {

  //   var newRes = []

  //   this.state.filteredResults.forEach(job => {
  //     if(job.siteName.toLowerCase().indexOf(this.state.searchedValue.toLowerCase()) !== -1) {
  //       newRes.push(job)
  //     }
  //   })
  //   this.setState({ filteredResults: newRes })
  // }

  selectJob = job => e => {
    this.setState({ selectedJob : job })
    this.setState({ hideFiltering: true })
    this.setState({ selectedJobToCompare : null })
  }

  // selectJobToCompare = job => e => {
  //   this.setState({ selectedJobToCompare : job })
  // }

  // toggleFiltering = () => {
  //   if(this.state.hideFiltering)
  //     this.setState({ hideFiltering: false })
  //   else
  //     this.setState({ hideFiltering: true })
  // }

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
                      presets={specs}
                    />
                  </div>
                  <div className='col-6'>
                    { this.state.selectedJob ?
                      <button onClick={this.toggleFiltering}>View Selected Job Results</button>
                      :
                      ''
                    }
                    <SearchJobs searchedValue={this.state.searchedValue} handleSearch={this.handleSearch} submitSearch={this.submitSearch}/>
                    { this.state.filteredPopResults ? 
                      <FilteredJobs results={this.state.filteredPopResults} selectJob={this.selectJob}/>
                      :
                      ''
                    }
                    {/* temp */}
                    <div>
                      {this.state.html ? 
                        this.state.html : ''
                      }
                    </div>
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
                      <FilteredJobs selectedJob={this.state.selectedJob} results={this.state.filteredPopResults} selectJob={this.selectJob} selectJobToCompare={this.selectJobToCompare}/>
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
