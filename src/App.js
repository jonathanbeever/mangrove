import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import NavBar from './components/navbar';
import QueueJob from './components/test.1'
import Catalog from './components/test'
import Settings from './components/test.2'

class App extends Component {
  
  constructor() {
    super();
    this.state = {
      pageComponent: <Catalog /> 
    };

    this.handleNavClick = this.handleNavClick.bind(this);
  }

  handleNavClick(e) {
    switch(e.target.innerText) {
      case 'Catalog': {
        this.setState({ pageComponent: <Catalog /> })
        break;
      }
      case 'Queue Job': {
        this.setState({ pageComponent: <QueueJob /> })
        break;      
      }
      case 'Settings': {
        this.setState({ pageComponent: <Settings /> })
        break;      
      }
      default: {
        this.setState({ pageComponent: <Catalog /> })
        break;      
      }
    }
  }

  render() {
    return (
      <div className="App">
        <NavBar selectedPage={this.state.pageComponent} onClick={this.handleNavClick}/>
        {/* Need to fix css, navbar covers page contents */}
        <div style={{margin: '0 0 0 280px'}}>
          {this.state.pageComponent}
        </div>
      </div>
    );
  }
}

export default App;
