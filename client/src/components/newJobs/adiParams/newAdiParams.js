import React, { Component } from 'react';
import '../newJobs.css';

class NewAciParams extends Component {
  render(props) {
    // TODO: fix shannon value to a boolean
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
        {/* Make work */}
        <div className="form-check">
          <label className="form-check-label">
            <input onClick={this.props.onChange} type="checkbox" className="form-check-input" id="shannon" value={this.props.params['shannon']} />
            Shannon Diversity
          </label>
        </div>
      </form>
    );
  }
}

export default NewAciParams;
