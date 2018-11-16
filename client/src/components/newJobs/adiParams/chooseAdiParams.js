import React, { Component } from 'react';
import NewAdiParams from './newAdiParams';
import PresetAdiParams from './presetAdiParams';

class ChooseAdiParams extends Component {
  render(props) {
    return (
      <div className="row">
        <div className="col-6">
          <h4>Create New Parameters</h4>
          <NewAdiParams params = {this.props.params} onChange={this.props.onChange} />
        </div>
        <div className="col-6">
          <h4>Preset ADI Parameters</h4>
          <PresetAdiParams params = {this.props.params} onChoosePreset={this.props.onChoosePreset} />
        </div>
      </div>
    );
  }
}

export default ChooseAdiParams;
