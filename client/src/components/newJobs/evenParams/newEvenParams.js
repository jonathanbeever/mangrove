import React, { Component } from 'react';
import '../newJobs.css';

class NewEvenParams extends Component {
  render(props) {
    // Add alias field and favorite checkbox
    return (
      <form>
        <div className="form-group row">
          <label htmlFor="maxFreq" className="col-5 col-form-label">Max Frequency</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['maxFreq']} id="maxFreq" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="dbThreshold" className="col-5 col-form-label">Db Threshold</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['dbThreshold']} id="dbThreshold" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="freqStep" className="col-5 col-form-label">Freq Step</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['freqStep']} id="freqStep" />
          </div>
        </div>
      </form>
    );
  }
}

export default NewEvenParams;
