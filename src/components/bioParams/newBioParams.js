import React, { Component } from 'react';
import '../newJobs.css';

class NewBioParams extends Component {
  render(props) {
    // Add alias field and favorite checkbox
    return (
      <form>
        <div className="form-group row">
          <label htmlFor="min-freq" className="col-5 col-form-label">Min Frequency</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['min-freq']} id="min-freq" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="max-freq" className="col-5 col-form-label">Max Frequency</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['max-freq']} id="max-freq" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="fft-w" className="col-5 col-form-label">fft-w</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['fft-w']} id="fft-w" />
          </div>
        </div>
      </form>
    );
  }
}

export default NewBioParams;
