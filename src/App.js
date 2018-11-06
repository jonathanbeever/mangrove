import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Catalog from './components/catalog';

const RESULTS = [
  {name: 'UCF Arboretum', date: '10/19/2018', index: 'NDSI', params: 'preset 2'},
  {name: 'Zoo', date: '11/5/2018', index: ['NDSI', 'ACI'], params: 'Default'}
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <Catalog
          results={RESULTS} />
      </div>
    );
  }
}



export default App;
