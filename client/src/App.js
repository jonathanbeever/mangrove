import React, { Component } from 'react';
import './App.css';
import NavBarTabs from './components/NavBarTabs';
import NewJobs from './components/newJobs/newJobs';
import Settings from './components/settings';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Catalog from './components/selectResults/catalog';
import JobQueue from './components/jobQueue/jobQueue';

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
            <NavBarTabs />
          </div>
          <Switch>
            {/* Add login */}
            <Route path="/catalog" component={Catalog} />
            <Route path="/newJobs" component={NewJobs} />
            <Route path="/settings" component={Settings} />
            <Route path="/jobQueue" component={JobQueue} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
