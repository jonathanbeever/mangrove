import React, { Component } from 'react';
import NewBioParams from './newBioParams';
import PresetBioParams from './presetBioParams';

class ChooseBioacousticParams extends Component {
  render(props) {
    return (
      <div className="row">
        <div className="col-6">
          <h4>Create New Parameters</h4>
          <NewBioParams params = {this.props.params} onChange={this.props.onChange} />
        </div>
        <div className="col-6">
          <h4>Preset Bioacoustic Parameters</h4>
          <PresetBioParams params = {this.props.params} onChoosePreset={this.props.onChoosePreset} />
        </div>
      </div>
    );
  }
}

export default ChooseBioacousticParams;
