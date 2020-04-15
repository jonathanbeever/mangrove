import React, { Component } from 'react';

class ReactPlayer extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      selectedTrack: this.props.urls[0],
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.selectedTrack !== prevState.selectedTrack) {
      let track;
      this.props.urls.forEach(url => {
        if (this.state.selectedTrack === url) track = `http://127.0.0.1:34251/audio/${url}`;
      })
      
      if (track) {
        console.log(track);
        this.player.src = track;
        this.player.play();
      }
    }
  }

  render () {
    const { urls } = this.props;
    console.log(urls);

    const list = urls.map(url => {
      return (
        <li key={url.id} onClick={() => this.setState({ selectedTrack: url })}>
          {url}
        </li>
      );
    });

    return (
      <div>
        <ul>{list}</ul>
        <audio ref={ref => this.player = ref} />
      </div>
    )
  }
}
// abcd1234
export default ReactPlayer;
