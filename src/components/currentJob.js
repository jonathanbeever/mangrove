import React, { Component } from 'react';
import './newJobs.css';

class CurrentJob extends Component {
  constructor(props) {
    super(props);

    this.state = {
        selectedIndex: '',
        changeIndexWarning: false,
        // params: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    this.setState({ params: nextProps.params });  
  }

  componentDidUpdate = (props) => {
      let params = this.props.params
      console.log(params)
  }

  render() {
    return (
      <div className="container-fluid">

      </div>
    );
  }
}

export default CurrentJob;
