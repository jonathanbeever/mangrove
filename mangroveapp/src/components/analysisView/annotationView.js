import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class AnnotationView extends Component {
  constructor(props){
    super(props);

    this.state = {
      note: "",
    }

  }

  _handleNoteChange = (e) => {
    this.setState({
      note: e.target.value
    });
  }

  handleEnter = (e) => {
    const annotationData = {
      note: this.state.note,
      jobId: this.props.jobId,
      X: this.props.X,
      Y: this.props.Y,
      graph: this.props.graph
    };

		if(e.key === 'Enter') this.props.handleCreateAnnotation(annotationData);
  }
  
  handleCreateAnnotation = (e) => {
    const annotationData = {
      note: this.state.note,
      jobId: this.props.jobId,
      X: this.props.X,
      Y: this.props.Y,
      graph: this.props.graph
    };

    this.props.handleCreateAnnotation(annotationData);
  }

  render() {
    return (
      <div>
        <p>Annotation</p>
        <TextField
          type="text"
          placeholder="Note"
          className="tfield"
          value={this.state.note}
          onKeyDown={this.handleEnter}
          onChange={this._handleNoteChange}
        />
        <Button onClick={this.handleCreateAnnotation}>Create Annotation</Button>
      </div>
    );
  }
}

export default AnnotationView;