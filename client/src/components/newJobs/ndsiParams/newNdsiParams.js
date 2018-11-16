import React, { Component } from 'react';
import '../newJobs.css';

class NewNdsiParams extends Component {
  render(props) {
    // Add alias field and favorite checkbox
    return (
      <form>
        <div className="form-group row">
          <label htmlFor="anthro-min" className="col-5 col-form-label">Anthro Min</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['anthro-min']} id="anthro-min" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="anthro-max" className="col-5 col-form-label">Anthro Max</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['anthro-max']} id="anthro-max" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="bio-min" className="col-5 col-form-label">Bio Min</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['bio-min']} id="bio-min" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="bio-max" className="col-5 col-form-label">Bio Max</label>
          <div className="col-6">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['bio-max']} id="bio-max" />
          </div>
        </div>
      </form>
    );
  }
}

export default NewNdsiParams;
