import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import NewJobs from './components/newJobs';
// import ChooseIndexButtons from './components/chooseParams/chooseIndexButtons';
// import ChooseAciParams from './components/chooseParams/chooseAciParams';
// import ChooseNdsiParams from './components/chooseParams/chooseNdsiParams';
// import ChooseAdiParams from './components/chooseParams/chooseAdiParams';
// import ChooseBioacousticParams from './components/chooseParams/chooseBioacousticParams';
// import ChooseEvennessParams from './components/chooseParams/chooseEvennessParams';
// import ChooseRmsParams from './components/chooseParams/chooseRmsParams';

class App extends Component {
  // constructor(props) {
  //   super(props);

  //   this.onClickIndex = this.onClickIndex.bind(this);
  //   this.handleParamChange = this.handleParamChange.bind(this);
  //   this.handleJobSubmit = this.handleJobSubmit.bind(this);
  //   this.cancelJob = this.cancelJob.bind(this)

  //   this.state = {
  //       selectedIndex: '',
  //       changeIndexWarning: false,
  //       params: ''
  //   };
  // }

  // onClickIndex = (e) => {
  //   // If another index is already select and the button clicked is disabled
  //   // tell user to start or cancel current job
  //   if(e.target.parentElement.className.indexOf('disabled') !== -1) {
  //     this.setState({changeIndexWarning: true})

  //     setTimeout(() => {this.setState({changeIndexWarning: false})}, 3000);
  //   }
  //   // Otherwise set state selectedIndex to name of index
  //   else {
  //     this.setState({selectedIndex: e.target.id})

  //     switch(e.target.id) {
  //       case 'aci': {
  //         this.setState({paramComp: <ChooseAciParams params = {this.state.params} onChange={this.handleParamChange} onSubmit={this.handleJobSubmit} />})
  //         break;
  //       }
  //       case 'ndsi': {
  //         this.setState({paramComp: <ChooseNdsiParams params = {this.state.params} onChange={this.handleParamChange} onSubmit={this.handleJobSubmit} />})
  //         break;
  //       }
  //       case 'adi': {
  //         this.setState({paramComp: <ChooseAdiParams params = {this.state.params} onChange={this.handleParamChange} onSubmit={this.handleJobSubmit} />})
  //         break;
  //       }
  //       case 'bioacoustic': {
  //         this.setState({paramComp: <ChooseBioacousticParams params = {this.state.params} onChange={this.handleParamChange} onSubmit={this.handleJobSubmit} />})
  //         break;
  //       }
  //       case 'evenness': {
  //         this.setState({paramComp: <ChooseEvennessParams params = {this.state.params} onChange={this.handleParamChange} onSubmit={this.handleJobSubmit} />})
  //         break;
  //       }
  //       case 'rms': {
  //         this.setState({paramComp: <ChooseRmsParams params = {this.state.params} onChange={this.handleParamChange} onSubmit={this.handleJobSubmit} />})
  //         break;
  //       }
  //     }
  //   }
  // }

  // handleParamChange (e) {
  //   let params = Object.assign({}, this.state.params);

  //   params[e.target.id] = e.target.value

  //   this.setState({params: params})
  // }

  // handleJobSubmit () {

  // }

  // cancelJob () {
  //   this.setState({selectedIndex: '', params: ''})
  // }

  render() {
    return (
      <div className="App">
      <NewJobs />
        {/* <div className="container-fluid">
          <div className="row">
            <div className='col-8'>
              <h2>Start New Jobs</h2>
              <h4>Select an index</h4>
            </div>
            <div className="col-4">
              <button className="btn btn-lg btn-info">Change Working Directory</button>
            </div>
          </div>
          <div className="row">
            <div className='col-12'>
              <ChooseIndexButtons selectedIndex = {this.state.selectedIndex} onClickIndex={this.onClickIndex}/>
              {this.state.changeIndexWarning ?
                (<div class="alert alert-warning" role="alert">
                  <strong>Warning!</strong> Start or cancel current job before starting a new one.
                </div>) : ''}
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              {this.state.selectedIndex ? (<div><h4>Choose {this.state.selectedIndex.toUpperCase()} Parameters</h4> {this.state.paramComp} </div>) : ''}
            </div>
          </div>
          <div className="row">
            <button className="btn btn-lg btn-info" onClick={this.cancelJob}>Cancel Job</button>
          </div>
        </div> */}
      </div>
    );
  }
}

export default App;
