import React, { Component } from 'react';

class NewAciParams extends Component {
  render(props) {
    return (
      <form>
        <div className="form-group row">
          <label htmlFor="min-freq" className="col-2 col-form-label">Min Frequency</label>
          <div className="col-5">
            <input onClick={this.props.onChange} className="form-control" type="text" value={this.props.params['min-freq']} id="min-freq" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="max-freq" className="col-2 col-form-label">Max Frequency</label>
          <div className="col-5">
            <input onClick={this.props.onChange} className="form-control" type="text" value={this.props.params['max-freq']} id="max-freq" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="j" className="col-2 col-form-label">j</label>
          <div className="col-5">
            <input onClick={this.props.onChange} className="form-control" type="text" value={this.props.params['j']} id="j" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="fft-w" className="col-2 col-form-label">fft-w</label>
          <div className="col-5">
            <input onClick={this.props.onChange} className="form-control" type="text" value={this.props.params['fft-w']} id="fft-w" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    );
  }
}

export default NewAciParams;
