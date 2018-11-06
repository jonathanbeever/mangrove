import React, { Component } from 'react';
import NewAciParams from './aciParams/newAciParams';
import PresetAciParams from './aciParams/presetAciParams';

class ChooseAciParams extends Component {
  render(props) {
    return (
      <div className="row">
        <div className="col-5">
          <h3>Create New Parameters</h3>
          <NewAciParams params = {this.props.params} onChange={this.props.onChange} />
        </div>
        <div className="col-5">
          <h3>Preset ACI Parameters</h3>
          <PresetAciParams params = {this.props.params} onChoosePreset={this.props.onChoosePreset} />
        </div>
      </div>
    );
  }
}

export default ChooseAciParams;
