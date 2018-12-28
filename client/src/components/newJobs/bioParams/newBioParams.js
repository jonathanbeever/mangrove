import React, { Component } from 'react';
import '../newJobs.css';

class NewBioParams extends Component {
  render(props) {
    // Add alias field and favorite checkbox
    return (
      <form>
        <div className="form-group row">
          <label htmlFor="minFreq" className="col-5 col-form-label">Min Frequency</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['minFreq']} id="minFreq" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="maxFreq" className="col-5 col-form-label">Max Frequency</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['maxFreq']} id="maxFreq" />
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

export default NewBioParams;
