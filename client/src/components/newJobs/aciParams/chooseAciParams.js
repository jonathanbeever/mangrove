import React, { Component } from 'react';
import NewAciParams from './newAciParams';
import PresetAciParams from './presetAciParams';

class ChooseAciParams extends Component {
  render(props) {
    return (
      <div className="row">
        <div className="col-6">
          <h4>Create New Parameters</h4>
          <NewAciParams params = {this.props.params} onChange={this.props.onChange} />
        </div>
        <div className="col-6">
          <h4>Preset ACI Parameters</h4>
          <PresetAciParams params = {this.props.params} onChoosePreset={this.props.onChoosePreset} />
        </div>
      </div>
    );
  }
}

export default ChooseAciParams;
