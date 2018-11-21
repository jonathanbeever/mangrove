import React, { Component } from 'react';
import './App.css';
import NavBar from './components/navbar';
import NewJobs from './components/newJobs/newJobs';
<<<<<<< HEAD
import Settings from './components/settings';
=======
// import Settings from './components/test.2';
>>>>>>> Moved chnages from old branch
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Catalog from './components/catalog/catalog';

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
            {/* <Route path="/settings" component={Settings} /> */}
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
