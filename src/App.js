import React, { Component } from 'react';
import './App.css';
import NavBar from './components/navbar';
import NewJobs from './components/newJobs/newJobs';
import Catalog from './components/test';
import Settings from './components/test.2';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

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
            <Route path="/catalog" component={Catalog} />
            <Route path="/newJobs" component={NewJobs} />
            <Route path="/settings" component={Settings} />
          </Switch>
        </div>
      </Router>
    );
  }
}
  
export default App;