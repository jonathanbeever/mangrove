import React, { Component } from 'react';
import './App.css';
import NewJobs from './components/newJobs';

class App extends Component {

  render() {
    return (
      <div className="App">
        <NewJobs />
      </div>
    );
  }
}

export default App;