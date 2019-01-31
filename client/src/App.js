import React, { Component } from 'react';
import './App.css';
import NavBarTabs from './components/NavBarTabs';
import NewJobs from './components/newJobs/newJobs';
import Settings from './components/settings';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Catalog from './components/selectResults/catalog';

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
            <Redirect from="/" to="/catalog" />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
