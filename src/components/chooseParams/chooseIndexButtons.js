import React, { Component } from 'react';

class App extends Component {
//   constructor(props) {
//     super(props);
//     // this.onClickIndex = this.onClickIndex.bind(this);
//     // this.state = {
//         // selectedIndex: ''
//     // };
//   }

//   onClickIndex = (e) => {
//     // If another index is already select and the button clicked is disabled
//     // tell user to start or cancel current job
//     if(e.target.parentElement.className.indexOf('disabled') !== -1)
//       alert('Start or cancel job')
//     // Otherwise set state selectedOption to name of index
//     else
//       this.setState({selectedIndex: e.target.id})
//   }

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
        </div>
    );
  }
}

export default App;
