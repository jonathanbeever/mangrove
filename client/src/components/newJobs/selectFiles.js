import React, { Component } from 'react';
import './newJobs.css';

class FileSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      // Make this do stuff
      <div>
        <h4>Select Files from (working dir)</h4>
          <div className="col-12">
            <button className="btn btn-info">Select All</button>
            <button className="btn btn-info">Remove All</button>
          </div>
          <div className="files col-12">
            <li>/zoo-2018</li>
            <li><input type="checkbox" /> hurricane-irma-123.wav</li>
            <li><input type="checkbox" /> hurricane-irma-124.wav</li>
            <li><input type="checkbox" /> hurricane-irma-125.wav</li>
            <li><input type="checkbox" /> hurricane-irma-126.wav</li>          
          </div>
      </div>
    );
  }
}

export default FileSelect;
