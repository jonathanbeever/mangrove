import React, { Component } from 'react';
import './newJobs.css';
import Stepper from './stepper';

class NewJobs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 'aci'
    };
  }

  changeIndex = (value) => {
    this.setState({ index: value })
  }

  render() {
    return (
      // Make this do stuff
      <div>
        <Stepper 
          changeIndex={this.changeIndex}
          index={this.state.index}
        />
      </div>
    );
  }
}

export default NewJobs;
