import React, { Component } from 'react';
import '../newJobs.css';

class NewAciParams extends Component {
  render(props) {
    // Add alias field and favorite checkbox
    return (
      <form>
        <div className="form-group row">
          <label htmlFor="max-freq" className="col-5 col-form-label">Max Frequency</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['max-freq']} id="min-freq" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="db-threshold" className="col-5 col-form-label">Db Threshold</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['db-threshold']} id="max-freq" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="freq-step" className="col-5 col-form-label">Freq Step</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['freq-step']} id="j" />
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
