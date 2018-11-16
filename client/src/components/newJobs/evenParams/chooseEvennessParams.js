import React, { Component } from 'react';
import NewEvenParams from './newEvenParams';
import PresetEvenParams from './presetEvenParams';

class ChooseEvennessParams extends Component {
  render(props) {
    return (
      <div className="row">
        <div className="col-6">
          <h4>Create New Parameters</h4>
          <NewEvenParams params = {this.props.params} onChange={this.props.onChange} />
        </div>
        <div className="col-6">
          <h4>Preset Evenness Parameters</h4>
          <PresetEvenParams params = {this.props.params} onChoosePreset={this.props.onChoosePreset} />
        </div>
      </div>
    );
  }
}

export default ChooseEvennessParams;