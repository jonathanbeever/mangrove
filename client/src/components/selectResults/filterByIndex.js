import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class FilterByIndex extends Component {
  render() {
    return (
      <Panel>
        <Panel.Heading>
          Filter By index
        </Panel.Heading>
        <Panel.Body>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.props.checkedAci}
                  onChange={this.props.onChange('checkedAci')}
                  value="aci"
                />
              }
              label="ACI"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.props.checkedNdsi}
                  onChange={this.props.onChange('checkedNdsi')}
                  value="ndsi"
                />
              }
              label="NDSI"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.props.checkedAdi}
                  onChange={this.props.onChange('checkedAdi')}
                  value="adi"
                />
              }
              label="ADI"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.props.checkedEven}
                  onChange={this.props.onChange('checkedEven')}
                  value="evenness"
                />
              }
              label="Evenness"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.props.checkedBio}
                  onChange={this.props.onChange('checkedBio')}
                  value="bioacoustic"
                />
              }
              label="Bioacoustic"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.props.checkedRms}
                  onChange={this.props.onChange('checkedRms')}
                  value="rms"
                />
              }
              label="RMS"
            />
          </FormGroup>
        </Panel.Body>
      </Panel>
    );
  }
}

export default FilterByIndex;