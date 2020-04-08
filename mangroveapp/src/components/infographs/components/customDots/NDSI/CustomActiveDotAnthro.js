import React, { Component } from 'react';

class CustomActiveDotAnthro extends Component {
  render() {
    const { cx, cy, payload, dataKey, graph } = this.props;

    return (
      <circle 
        className="recharts-dot" 
        cx={cx} 
        cy={cy} 
        r={5}
        x={payload.name}
        y={payload.anthrophony}
        jobid={payload.jobId}
        name={payload.name}
        filename={payload.fileName}
        downloadurl={payload.downloadUrl}
        key={dataKey}
        graph={graph}
      />
    );
  }
}

export default CustomActiveDotAnthro;