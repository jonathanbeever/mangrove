import React, { Component } from 'react';

class ChooseNdsiParams extends Component {
  render(props) {
    return (
      <form>
        <div className="form-group row">
          <label htmlFor="anthro-min" className="col-2 col-form-label">Anthro Min</label>
          <div className="col-5">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['anthro-min']} id="anthro-min" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="anthro-max" className="col-2 col-form-label">Anthro Max</label>
          <div className="col-5">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['anthro-max']} id="anthro-max" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="bio-min" className="col-2 col-form-label">Bio Min</label>
          <div className="col-5">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['bio-min']} id="bio-min" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="bio-max" className="col-2 col-form-label">Bio Max</label>
          <div className="col-5">
            <input onChange={this.props.onChange} className="form-control" type="text" value={this.props.params['bio-max']} id="bio-max" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    );
  }
}

export default ChooseNdsiParams;
