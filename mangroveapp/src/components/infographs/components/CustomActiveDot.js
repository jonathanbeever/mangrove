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
        aciLeft={payload.aciLeft}
        aciRight={payload.aciRight}
        stamp={payload.stamp}
        name={payload.name}
        fileName={payload.fileName}
        downloadurl={payload.downloadUrl}
      />
    );
  }
}

export default CustomActiveDot;