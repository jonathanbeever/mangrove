import React, { Component } from 'react';
import ChooseIndexButtons from './chooseIndexButtons';
import ChooseAciParams from './aciParams/chooseAciParams';
import ChooseNdsiParams from './ndsiParams/chooseNdsiParams';
import ChooseAdiParams from './adiParams/chooseAdiParams';
import ChooseBioacousticParams from './bioParams/chooseBioacousticParams';
import ChooseEvennessParams from './evenParams/chooseEvennessParams';
import ChooseRmsParams from './rmsParams/chooseRmsParams';
import FileSelect from './selectFiles';
import './newJobs.css';
import axios from 'axios';

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
        params: '',
        inputs: ["5c2547480af83b2bac5133f7","5c2547480bf83b2bac5133f7","5c2547480cf83b2bac5133f7"]
    };
  }

  componentDidUpdate(prevProps, prevState) {
  }

  componentWillUpdate(nextProps, nextState) {
  }

  onChoosePreset = (e) => {
    let params = Object.assign({}, this.state.params);
    let target = e.target.parentElement.parentElement
    let inputHtml = []
    // are params and html state needed?
    while(target.previousSibling != null) {

      let temp = <div key={target.previousSibling.id}>{target.previousSibling.id} : {target.previousSibling.children[1].textContent} </div>
      inputHtml.push(temp)

      params[target.previousSibling.id] = target.previousSibling.children[1].textContent

      target = target.previousSibling
    }
    // this.setState({params: params})    
    // test ACI spec
    this.setState({specId: "5c2547480af83b2bac5133f6"})

    inputHtml = (<div><h3>{this.state.selectedIndex}</h3>{inputHtml.reverse()}</div>)
 
    this.setState({inputHtml: inputHtml})
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
        case 'bi': {
          this.setState({paramComp: <ChooseBioacousticParams params = {this.state.params} onChange={this.handleParamChange} onChoosePreset={this.onChoosePreset} />})
          break;
        }
        case 'aei': {
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
    // To pass to other components
    let params = Object.assign({}, this.state.params);
    // Set specType for new job request
    params["specType"] = this.state.selectedIndex + 'Spec'
    // Set author until users are implemented
    params["author"] = "Test Author"
    // Set index parameters
    if(e.target.id === 'shannon')
      params[e.target.id] = e.target.checked
    else
      params[e.target.id] = e.target.value

    this.setState({params: params});

    // For rendering to screen, may remove later
    let keys = Object.keys(params)
    let inputHtml = ''

    let htmlJob = keys.map(key => {
      return (<div key={key}> {key} : {params[key]} </div>)
    })
    inputHtml = (<div><h3>{this.state.selectedIndex}</h3>{htmlJob}</div>)
 
    this.setState({inputHtml: inputHtml})
  }

  handleJobSubmit () {
    // Find or create spec
    axios.put(
        "http://localhost:3000/specs",  
        this.state.params,
        {headers: {"Content-Type": "application/json"}}
    )
    .then(res => {
      // var to hold id of created or found spec
      var specId = ''
      // If new spec was create set id
      if(res.status === 201) 
        specId = res.data.createResult._id
      // Spec already exists, save id
      else if(res.status === 200) 
        specId = res.data.returnSpec[0]._id
      // Loop through inputs and make requests
      this.state.inputs.forEach(inputId => {
        // Request to queue new job
        axios.put(
          "http://localhost:3000/jobs",  
          {
            type: this.state.selectedIndex,
            // Add a document with this id to inputs collection until input api req is set up
            inputId: inputId,
            specId: specId
          },
          {headers: {"Content-Type": "application/json"}}
        )
        .then(res => {
          if(res.status === 201)
            alert('Job queued')
          else if(res.status === 200)
            alert('Job already created')
        })
        .catch(err => console.log(err));
      })
    })
    .catch(err => console.log(err));

  }

  cancelJob () {
    this.setState({selectedIndex: '', params: '', inputHtml: ''})
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
          <div className="col-3 currentJob">
            {this.state.params ? (<div><h4>Current Job</h4>{this.state.inputHtml}<div className="col-12"><button type="submit" onClick={this.handleJobSubmit} className="startJob btn btn-primary">Add Job to Queue</button></div></div>) : ''}
          </div>
        </div>
      </div>
    );
  }
}

export default NewJobs;
