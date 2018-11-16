import React, { Component } from 'react';
import NewNdsiParams from './newNdsiParams';
import PresetNdsiParams from './presetNdsiParams';

class ChooseNdsiParams extends Component {
  render(props) {
    return (
      <div className="row">
        <div className="col-6">
          <h4>Create New Parameters</h4>
          <NewNdsiParams params = {this.props.params} onChange={this.props.onChange} />
        </div>
        <div className="col-6">
          <h4>Preset Ndsi Parameters</h4>
          <PresetNdsiParams params = {this.props.params} onChoosePreset={this.props.onChoosePreset} />
        </div>
      </div>
    );
  }
}

export default ChooseNdsiParams;
