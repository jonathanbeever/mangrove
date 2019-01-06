import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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
    


  }

  // 

  render() {
    return (
      <div className='col-12'>
      </div>
    );
  }
}

export default SelectResults;
