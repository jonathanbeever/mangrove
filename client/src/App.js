import React, { Component } from 'react';
import './App.css';
import NavBar from './components/navbar';
import NewJobs from './components/newJobs/newJobs';
import Settings from './components/settings';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Catalog from './components/catalog/catalog';

const RESULTS = [
  {name: 'UCF Arboretum', date: '10/19/2018', index: ['NDSI'], params: 'preset 2',
    results: {
      ndsi_left:-0.3034096,
      ndsi_right:-0.4155783,
      biophony_left:0.5152629,
      biophony_right:0.4037672,
      anthrophony_left:0.9641227,
      anthrophony_right:0.9779994
    }
  },
  {name: 'Zoo', date: '11/5/2018', index: ['NDSI', 'ACI'], params: 'Default'},
  {name: 'Site1', date: '12/5/2018', index: ['ADI', 'ACI'], params: 'preset 1'},
  {name: 'Site2', date: '10/5/2018', index: ['NDSI'], params: 'preset 3'},
  {name: 'Site3', date: '9/5/2018', index: ['NDSI'], params: 'Default'},
  {name: 'Site4', date: '8/5/2018', index: ['ADI'], params: 'Default'},
  {name: 'Site5', date: '7/5/2018', index: ['ACI'], params: 'preset 3'},
  {name: 'Site6', date: '6/5/2018', index: ['NDSI'], params: 'Default'},
  {name: 'Site7', date: '5/5/2018', index: ['ACI'], params: 'preset 2'},
  {name: 'Site8', date: '4/5/2018', index: ['NDSI'], params: 'preset 1'},
  {name: 'Site9', date: '3/5/2018', index: ['NDSI'], params: 'Default'}
];

// $ndsi_left
// [1] -0.3034096
//
// $ndsi_right
// [1] -0.4155783
//
// $biophony_left
// [1] 0.5152629
//
// $anthrophony_left
// [1] 0.9641227
//
// $biophony_right
// [1] 0.4037672
//
// $anthrophony_right
// [1] 0.9779994

class App extends Component {

  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <Router>
        <div>
          <div className="App">
            <NavBar />
          </div>
          <Switch>
            {/* Add login */}
            <Route path="/catalog" render={() => <Catalog results={RESULTS} />}/>
            <Route path="/newJobs" component={NewJobs} />
            <Route path="/settings" component={Settings} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
