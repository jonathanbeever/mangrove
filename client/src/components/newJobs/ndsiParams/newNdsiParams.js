import React, { Component } from 'react';
import '../newJobs.css';

class NewNdsiParams extends Component {
  render(props) {
    // Add alias field and favorite checkbox
    return (
      <form>
        <div className="form-group row">
          <label htmlFor="anthroMin" className="col-5 col-form-label">Anthro Min</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['anthroMin']} id="anthroMin" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="anthroMax" className="col-5 col-form-label">Anthro Max</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['anthroMax']} id="anthroMax" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="bioMin" className="col-5 col-form-label">Bio Min</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['bioMin']} id="bioMin" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="bioMax" className="col-5 col-form-label">Bio Max</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['bioMax']} id="bioMax" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="fftW" className="col-5 col-form-label">fft-w</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['fftW']} id="fftW" />
          </div>
        </div>
      </form>
    );
  }
}

export default NewNdsiParams;
