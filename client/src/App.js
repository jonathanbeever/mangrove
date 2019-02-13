import React, { Component } from 'react';
import './App.css';
import NavBarTabs from './components/NavBarTabs';
import NewJobs from './components/newJobs/stepper';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
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
            <Route path="/jobQueue" component={JobQueue} />
            <Redirect from="/" to="/catalog" />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
