import React, { Component } from 'react';

class CustomDot extends Component {
  render() {
    const { cx, cy, payload, annotations, graph } = this.props;
    let isVisible = false;

    if (annotations !== undefined)
    {
      // Switch Case to restrict annotations to their graphs
      switch (graph) {
        case 'ACI By Seconds Per File':
          if (annotations.filter((annotation) => {
            // Returns true if there is an annotation at the current point
            return  annotation.annotationGraph === 'ACI By Seconds Per File' &&
                    parseInt(annotation.dataPoint.Y) === payload.stamp &&
                    (parseFloat(annotation.dataPoint.X) === payload.aciRight || 
                    parseFloat(annotation.dataPoint.X) === payload.aciLeft);
          }).length > 0)
          {
            isVisible = true;
          }
          break;
        case 'ACI By Seconds':
        case 'ACI By Band Range':
          break;
        case 'ACI By Date And Hour':
          if (annotations.filter((annotation) => {
            // Returns true if there is an annotation at the current point
            return  annotation.annotationGraph === 'ACI By Date And Hour' &&
            annotation.dataPoint.X === payload.name &&
            (parseFloat(annotation.dataPoint.Y) === payload.aciRight || 
            parseFloat(annotation.dataPoint.Y) === payload.aciLeft);
          }).length > 0)
          {
            isVisible = true;
          }
          break;
        case 'ACI By File':
          if (annotations.filter((annotation) => {
            // Returns true if there is an annotation at the current point
            return  annotation.annotationGraph === 'ACI By File' &&
                    annotation.dataPoint.X === payload.name &&
                    (parseFloat(annotation.dataPoint.Y) === payload.aciRight || 
                    parseFloat(annotation.dataPoint.Y) === payload.aciLeft);
          }).length > 0)
          {
            isVisible = true;
          }
          break;
        
        case 'NDSI By Date and Hour':
          if (annotations.filter((annotation) => {
            // Returns strue if there is an annotation at the current point
            return annotation.annotationGraph === 'NDSI By Date and Hour' &&
                   annotation.dataPoint.X === payload.name &&
                   (parseFloat(annotation.dataPoint.Y) === payload.ndsi ||
                   parseFloat(annotation.dataPoint.Y) === payload.biophony ||
                   parseFloat(annotation.dataPoint.Y) === payload.anthrophony);
          }).length > 0) {
            isVisible = true;
          }
          break;

        case 'ADI Value By Band Range':
          break;
        case 'ADI Band Range Values By File':
          break;
        case 'ADI Average By File':
          break;
        case 'ADI Average By Date And Hour':
          break;
          
        case 'AEI By Band Range':
          break;
        case 'AEI Band Range Values By File':
          break;
        case 'AEI By File':
          break;
        case 'AEI By Date And Hour':
          break;
        
        case 'Bioacoustic Value By File':
          break;
        case 'Bioacoustic Spectrum Values':
          break;
        case 'Bioacoustic Area Value By File':
          break;
        case 'Bioacoustic Area Value By Date And Hour':
          break;

        default:
          break;
      }
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