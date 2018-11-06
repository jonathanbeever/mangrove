import React, { Component } from 'react';
import ChooseIndexButtons from './chooseIndexButtons';
import ChooseAciParams from './aciParams/chooseAciParams';
import ChooseNdsiParams from './ndsiParams/chooseNdsiParams';
import ChooseAdiParams from './adiParams/chooseAdiParams';
import ChooseBioacousticParams from './bioParams/chooseBioacousticParams';
import ChooseEvennessParams from './evenParams/chooseEvennessParams';
import ChooseRmsParams from './rmsParams/chooseRmsParams';
import FileSelect from './selectFiles';

class NewJobs extends Component {
  constructor(props) {
    super(props);

    this.onClickIndex = this.onClickIndex.bind(this);
    this.handleParamChange = this.handleParamChange.bind(this);
    this.handleJobSubmit = this.handleJobSubmit.bind(this);
    this.cancelJob = this.cancelJob.bind(this);
    this.onChoosePreset = this.onChoosePreset.bind(this)

    this.state = {
        selectedIndex: '',
        changeIndexWarning: false,
        params: ''
    };
  }

  onChoosePreset = (e) => {
    // clear params
    let params = Object.assign({}, this.state.params);
    
    while(e.target.previousSibling != null) {
      params[e.target.previousSibling.id] = e.target.previousSibling.children[1].textContent

      e.target = e.target.previousSibling
    }
    this.setState({params: params})    
  }

  timer = () => {setTimeout(() => {this.setState({changeIndexWarning: false})}, 3000)}

  onClickIndex = (e) => {
    // If another index is already select and the button clicked is disabled
    // tell user to start or cancel current job
    if(e.target.parentElement.className.indexOf('disabled') !== -1) {
      this.setState({changeIndexWarning: true})

      this.timer()
    }
    // Otherwise set state selectedIndex to name of index
    else {
      this.setState({selectedIndex: e.target.id})

      switch(e.target.id) {
        case 'aci': {
          this.setState({paramComp: <ChooseAciParams params = {this.state.params} onChange={this.handleParamChange} onChoosePreset={this.onChoosePreset} />})
          break;
        }
        case 'ndsi': {
          this.setState({paramComp: <ChooseNdsiParams params = {this.state.params} onChange={this.handleParamChange} onChoosePreset={this.onChoosePreset} />})
          break;
        }
        case 'adi': {
          this.setState({paramComp: <ChooseAdiParams params = {this.state.params} onChange={this.handleParamChange} onChoosePreset={this.onChoosePreset} />})
          break;
        }
        case 'bioacoustic': {
          this.setState({paramComp: <ChooseBioacousticParams params = {this.state.params} onChange={this.handleParamChange} onChoosePreset={this.onChoosePreset} />})
          break;
        }
        case 'evenness': {
          this.setState({paramComp: <ChooseEvennessParams params = {this.state.params} onChange={this.handleParamChange} onChoosePreset={this.onChoosePreset} />})
          break;
        }
        case 'rms': {
          this.setState({paramComp: <ChooseRmsParams params = {this.state.params} onChange={this.handleParamChange} onChoosePreset={this.onChoosePreset} />})
          break;
        }
        default: {

          break;
        }
      }
    }
  }

  handleParamChange (e) {
    let params = Object.assign({}, this.state.params);

    params[e.target.id] = e.target.value

    this.setState({params: params})
  }

  handleJobSubmit () {

  }

  cancelJob () {
    this.setState({selectedIndex: '', params: ''})
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className='col-4'>
          </div>
          <div className='col-4'>
            <h2>Start New Jobs</h2>
            <h4>Select an index</h4>
          </div>
          <div className="col-4">
            <button className="btn btn-lg btn-info">Change Working Directory</button>
          </div>
        </div>
        <div className="row">
          <div className='col-12'>
            <ChooseIndexButtons selectedIndex = {this.state.selectedIndex} onClickIndex={this.onClickIndex} onCancel={this.cancelJob}/>
            {/* Show alert if changeIndexWarning is true */}
            {this.state.changeIndexWarning ?
              (<div className="alert alert-warning" role="alert">
                <strong>Warning!</strong> Start or cancel current job before starting a new one.
              </div>) : ''}
          </div>
        </div>
        <div className="row">
          <div className="fileSelect col-3">
            <FileSelect />
          </div>
          <div className="col-6 jobInput">
            {this.state.selectedIndex ? (<div>{this.state.paramComp}</div>) : ''}
            {/* Put this button where? 
                Only show after all input info is set as state*/}
            {/* <button type="submit" className="btn btn-primary">Add Job to Queue</button> */}
          </div>
          <div className="col-3">
          hiii
          </div>
        </div>
      </div>
    );
  }
}

export default NewJobs;
