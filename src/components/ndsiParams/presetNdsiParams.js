import React, { Component } from 'react';
import '../newJobs.css';

// on componentDidMount call get Ndsi presets for user
// 

class PresetNdsiParams extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  // Toggles view of preset parameters when dropdown arrow is clicked
  onClickPreset = (e) => {
    let selectedSpecs = e.target.nextSibling

    if(selectedSpecs.hasAttribute('hidden'))
      selectedSpecs.removeAttribute('hidden')
    else
      selectedSpecs.setAttribute('hidden', true)
  }

  componentDidMount = () => {

    // Returned from query when component is loaded
    let  paramPresets = [
      {
        id: 123,
        alias: 'preset 1',
        anthroMin: 0,
        anthroMax: 1000,
        bioMin: 5,
        bioMax: 30
      },
      {
        id: 125,
        alias: 'preset 2',
        anthroMin: 1000,
        anthroMax: 1200,
        bioMin: 5,
        bioMax: 30
      },
      {
        id: 500,
        alias: 'preset 3',
        anthroMin: 500,
        anthroMax: 1000,
        bioMin: 5,
        bioMax: 10
      }
    ]

    // Map json object of param sets to html to render
    var htmlPresets = paramPresets.map((item, index) => {
      return (
        <li key={item.id} className="list-group-item" id={item.id}>
          <h4 class="presetAlias" name='alias'>{item.alias}&nbsp;&nbsp;</h4>
          <button onClick={this.onClickPreset} className="btn btn-info dropdown-toggle presetDropdown" type="button"></button>
          {/* Hide details of param set until dropdown is clicked */}
          <div hidden={true}>
            <div className="row presetField" id='anthro-min'><strong>Anthro Min:&nbsp;</strong> <p>{item.anthroMin}</p></div>
            <div className="row presetField" id='anthro-max'><strong>Anthro Max:&nbsp;</strong> <p>{item.anthroMax}</p></div>
            <div className="row presetField" id='bio-min'><strong>Bio Min:&nbsp;</strong> <p>{item.bioMin}</p></div>
            <div className="row presetField" id='bio-max'><strong>Bio Max:&nbsp;</strong> <p>{item.bioMax}</p></div>
            <div className="row">
              <div className="col-12">
                <button className="selectPreset btn btn-info" onClick={this.props.onChoosePreset}>Select</button>
              </div>
            </div>
          </div>
        </li>
      )
    })

    this.setState({htmlPresets: htmlPresets})
  }
  render(props) {
    return (
      <div className="col-12">
        <ul className="list-group">
          {this.state.htmlPresets ? this.state.htmlPresets : ''}
        </ul> 
      </div>
    );
  }
}

export default PresetNdsiParams;
