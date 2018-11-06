import React, { Component } from 'react';

class App extends Component {
  render(props) {
    return (
      <div className="btn-group btn-group-toggle" data-toggle="buttons">
        <label className={"btn btn-lg btn-info" + (this.props.selectedIndex === '' ? '' : (this.props.selectedIndex === 'aci' ? '':' disabled'))}>
          <input onClick={this.props.onClickIndex} type="radio" name="options" id="aci" autoComplete="off"/> ACI
        </label>
        <label className={"btn btn-lg btn-info" + (this.props.selectedIndex === '' ? '' : (this.props.selectedIndex === 'ndsi' ? '':' disabled'))}>
          <input onClick={this.props.onClickIndex} type="radio" name="options" id="ndsi" autoComplete="off"/> NDSI
        </label>
        <label className={"btn btn-lg btn-info" + (this.props.selectedIndex === '' ? '' : (this.props.selectedIndex === 'adi' ? '':' disabled'))}>
          <input onClick={this.props.onClickIndex} type="radio" name="options" id="adi" autoComplete="off"/> ADI
        </label>
        <label className={"btn btn-lg btn-info" + (this.props.selectedIndex === '' ? '' : (this.props.selectedIndex === 'evenness' ? '':' disabled'))}>
          <input onClick={this.props.onClickIndex} type="radio" name="options" id="evenness" autoComplete="off"/> Evenness
        </label>
        <label className={"btn btn-lg btn-info" + (this.props.selectedIndex === '' ? '' : (this.props.selectedIndex === 'bioacoustic' ? '':' disabled'))}>
          <input onClick={this.props.onClickIndex} type="radio" name="options" id="bioacoustic" autoComplete="off"/> Bioacoustic
        </label>
        <label className={"btn btn-lg btn-info" + (this.props.selectedIndex === '' ? '' : (this.props.selectedIndex === 'rms' ? '':' disabled'))}>
          <input onClick={this.props.onClickIndex} type="radio" name="options" id="rms" autoComplete="off"/> RMS
        </label>
        <button className={"btn btn-lg btn-info" + (this.props.selectedIndex === '' ? ' disabled' : '')} onClick={this.props.onCancel}>Cancel Job</button>
      </div>
    );
  }
}

export default App;
