import React, { Component } from 'react';

// on componentDidMount call get aci presets for user
// 

class PresetAciParams extends Component {

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
        minFreq: 0,
        maxFreq: 1000,
        j: 5,
        fftW: 30
      },
      {
        id: 125,
        alias: 'preset 2',
        minFreq: 1000,
        maxFreq: 1200,
        j: 5,
        fftW: 30
      },
      {
        id: 500,
        alias: 'preset 3',
        minFreq: 500,
        maxFreq: 1000,
        j: 5,
        fftW: 10
      }
    ]

    // Map json object of param sets to html to render
    var htmlPresets = paramPresets.map((item, index) => {
      return (
        <li key={item.id} className="list-group-item" id={item.id}>
          <h4 class="presetAlias" name='alias'>{item.alias}&nbsp;&nbsp;</h4>
          <button onClick={this.onClickPreset} className="btn btn-secondary dropdown-toggle presetDropdown" type="button"></button>
          {/* Hide details of param set until dropdown is clicked */}
          <div hidden={true}>
            <div id='min-freq'><strong>min freq:</strong> <p>{item.minFreq}</p></div>
            <div id='max-freq'><strong>max freq:</strong> <p>{item.maxFreq}</p></div>
            <div id='j'><strong>j: </strong> <p>{item.j}</p></div>
            <div id='fft-w'><strong>fftW:</strong> <p>{item.fftW}</p></div>
            <button className="btn btn-secondary" onClick={this.props.onChoosePreset}>Select</button>
          </div>
        </li>
      )
    })

    this.setState({htmlPresets: htmlPresets})
  }
  render(props) {
    return (
      <div className="col-10">
        <ul className="list-group">
          {this.state.htmlPresets ? this.state.htmlPresets : ''}
        </ul> 
      </div>
    );
  }
}

export default PresetAciParams;
