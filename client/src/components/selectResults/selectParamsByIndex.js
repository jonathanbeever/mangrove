import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
// import Checkbox from '@material-ui/core/Checkbox';
// import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';

class SelectParamsByIndex extends Component {
  constructor() {
    super();

    this.state = {
    };

    this.filterPresets = this.filterPresets.bind(this)
  }

  componentDidMount = () => {
    this.filterPresets(this.props)
  }

  componentWillReceiveProps = (nextProps) => {
    this.filterPresets(nextProps)
  }

  filterPresets = (props) => {
    const indices = ['aci', 'ndsi', 'adi', 'even', 'bio', 'rms']
 
    var formattedPresets = indices.map(index => {
      // If index checkbox is checked and presets for this index exist
      if(props[index] === true && props.presets[index]) {
        return (
          <div key={index}>
            <h5>
              {index + ' Parameter Presets'} 
            </h5>
            {props.presets[index].map((indexPresets, position) => {
              var specType = Object.keys(indexPresets); 

              return (
                <div key={position}>
                  {specType.map((spec, i) => { 
                    return (
                      <div key={index+'-'+spec}>
                        <p><strong>{spec}</strong> : {indexPresets[spec]}</p>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )
      }
      else return ''
    })
    this.setState({ formattedPresets: formattedPresets })
  }

  render() {
    return (
      <Panel>
        <Panel.Heading>
          Filter By Job Parameters
        </Panel.Heading>
        <Panel.Body>
          { this.state.formattedPresets ? this.state.formattedPresets : '' }
        </Panel.Body>
      </Panel>
    );
  }
}

export default SelectParamsByIndex;