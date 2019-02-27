import React, { Component } from 'react';
import './App.css';
import NavBarTabs from './components/NavBarTabs';
import NewJobs from './components/newJobs/stepper';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Catalog from './components/selectResults/catalog';
import JobQueue from './components/jobQueue/jobQueue';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  overrides: {
    MuiButton: {
      text: {
        background: 'linear-gradient(to bottom right, #4d9574, #b6cd26)',
        fontSize: 13,
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 28,
        padding: '0 20px',
        boxShadow: '0 1px 1px 1px #606060',
      },
    },
    MuiRadio: {
        checked: {
      colorPrimary: '#b6cd26'}
    }
  },
  typography: { useNextVariants: true },
});

class App extends Component {

  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <div className="App">
            <style>{'html { height: 100%;}'}</style>
            {/* Uncomment for gradient background */}
            {/* <style>{'body { background-color:#fafafa; background-image: linear-gradient(to bottom right, #4d9574, #b6cd26); background-repeat: no-repeat; height: 100%; background-attachment: fixed;}'}</style> */}
            <NavBarTabs />
          </div>
          <Switch>
            {/* Add login */}
            <Route path="/catalog" component={Catalog} />
            <Route path="/newJobs" component={NewJobs} />
            <Route path="/jobQueue" component={JobQueue} />
            <Redirect from="/" to="/catalog" />
          </Switch>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default App;
