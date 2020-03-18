import React, { Component } from 'react';

class CustomDot extends Component {
  render() {
    const { cx, cy, payload, rows } = this.props;
    let isVisible = false;

    if (rows.filter((row) => 
      { return parseInt(row.dataPoint.X) === payload.stamp && 
                parseFloat(row.dataPoint.Y1) === payload.aciLeft && 
                parseFloat(row.dataPoint.Y2) === payload.aciRight; }
    ).length > 0) {
      isVisible = true;
    }

    const visibility = ( isVisible ? "visible" : "hidden" );

    const sideLen = 5;
    const x = cx - sideLen/2;
    const y = cy - sideLen/2;
    
    return (
      <rect
        width={sideLen}
        height={sideLen}
        x={x}
        y={y}
        visibility={visibility}
      />
    );
  }
}

export default CustomDot;