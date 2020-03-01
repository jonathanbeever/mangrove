import React, { Component } from 'react';

class CustomActiveDot extends Component {
  render() {
    const { cx, cy, payload } = this.props;

    return (
      <circle 
        className="recharts-dot" 
        cx={cx} 
        cy={cy} 
        r={5}
        acileft={payload.aciLeft}
        aciright={payload.aciRight}
        stamp={payload.stamp}
        name={payload.name}
        filename={payload.fileName}
        downloadurl={payload.downloadUrl}
      />
    );
  }
}

export default CustomActiveDot;