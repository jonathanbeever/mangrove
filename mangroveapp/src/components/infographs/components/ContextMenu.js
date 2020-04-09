import React, { Component } from 'react';

class ContextMenu extends Component {
  state = {
      visible: false,
  };
  
  componentDidMount() {
      document.addEventListener('contextmenu', this._handleContextMenu)
      document.addEventListener('click', this._handleClick);
      document.addEventListener('scroll', this._handleScroll);
  };

  componentWillUnmount() {
    document.removeEventListener('contextmenu', this._handleContextMenu)
    document.removeEventListener('click', this._handleClick);
    document.removeEventListener('scroll', this._handleScroll);
  }
  
  _handleContextMenu = (event) => {
      event.preventDefault();
      const clickX = event.clientX;
      const clickY = event.clientY;

      if (document.elementFromPoint(clickX, clickY).classList.contains("recharts-dot")) {
        const cx = document.elementFromPoint(clickX, clickY).getAttribute('cx');
        const cy = document.elementFromPoint(clickX, clickY).getAttribute('cy');
        let data = {
            type: document.elementFromPoint(clickX, clickY).getAttribute('index'),
            graph: document.elementFromPoint(clickX, clickY).getAttribute('graph'),
            src: document.elementFromPoint(clickX, clickY).getAttribute('src'),
            payload: {
                X: document.elementFromPoint(clickX, clickY).getAttribute('x'),
                Y: document.elementFromPoint(clickX, clickY).getAttribute('y'),
                name: document.elementFromPoint(clickX, clickY).getAttribute('name'),
                fileName: document.elementFromPoint(clickX, clickY).getAttribute('filename'),
                downloadUrl: document.elementFromPoint(clickX, clickY).getAttribute('downloadurl'),
                jobId: document.elementFromPoint(clickX, clickY).getAttribute('jobid')
            }
        }

        this.setState({ visible: true, cx: cx, cy: cy, data: data });

        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const rootW = this.root.offsetWidth;
        const rootH = this.root.offsetHeight;
        
        const right = (screenW - clickX) > rootW;
        const left = !right;
        const top = (screenH - clickY) > rootH;
        const bottom = !top;
  
        if (right) {
            this.root.style.left = `${clickX + 5}px`;
        }
        
        if (left) {
            this.root.style.left = `${clickX - rootW - 5}px`;
        }
        
        if (top) {
            this.root.style.top = `${clickY + 5}px`;
        }
        
        if (bottom) {
            this.root.style.top = `${clickY - rootH - 5}px`;
        }
      }
  };

  openAnnotationView = () => {
    this.props.initializeAnnotationViewData(this.state.data);
  }

  openAudioView = () => {
      this.props.audioCallback(this.state.data);
  }

  handleMouseLeave = () => {
      this.setState({ visible: false });
  }

  _handleClick = (event) => {
      const { visible } = this.state;
      const wasOutside = !(event.target.contains === this.root);
      
      if (wasOutside && visible) this.setState({ visible: false, });
  };

  _handleScroll = () => {
      const { visible } = this.state;
      
      if (visible) this.setState({ visible: false, });
  };
  
  render() {
      const { visible } = this.state;

      return(visible || null) && 
          <div ref={ref => {this.root = ref}} className="contextMenu" onMouseLeave={this.handleMouseLeave}>
              <div className="contextMenu--separator" />
              <div className="contextMenu--option" onClick={this.openAnnotationView}>
                Annotate
              </div>
              <div className="contextMenu--option" onClick={this.openAudioView}>
                  Play Sound
              </div>
          </div>
  };
}

export default ContextMenu;