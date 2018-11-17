import React, { Component } from 'react';
import './App.css';
import NavBar from './components/navbar';
import NewJobs from './components/newJobs/newJobs';
import Settings from './components/settings';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Catalog from './components/catalog/catalog';

const RESULTS = [
  {name: 'UCF Arboretum', date: '10/19/2018', index: ['NDSI'], params: 'preset 2'},
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
