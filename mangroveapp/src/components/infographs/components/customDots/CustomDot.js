import React, { Component } from 'react';
import SoundTypes from '../../../../constants/analysis/soundTypes'

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
          if (annotations.filter((annotation) => {
            // Returns strue if there is an annotation at the current point
            return annotation.annotationGraph === 'ADI Value By Band Range' &&
                   annotation.dataPoint.X === payload.name &&
                   (parseFloat(annotation.dataPoint.Y) === payload.leftBandVal ||
                   parseFloat(annotation.dataPoint.Y) === payload.rightBandVal);
          }).length > 0) {
            isVisible = true;
          }
          break;

        case 'ADI Average By File':
          if (annotations.filter((annotation) => {
            // Returns strue if there is an annotation at the current point
            return annotation.annotationGraph === 'ADI Average By File' &&
                   annotation.dataPoint.X === payload.name &&
                   (parseFloat(annotation.dataPoint.Y) === payload.leftADIVal ||
                   parseFloat(annotation.dataPoint.Y) === payload.rightADIVal);
          }).length > 0) {
            isVisible = true;
          }
          break;

        case 'ADI Average By Date And Hour':
          if (annotations.filter((annotation) => {
            // Returns strue if there is an annotation at the current point
            return annotation.annotationGraph === 'ADI Average By Date And Hour' &&
                   annotation.dataPoint.X === payload.name &&
                   (parseFloat(annotation.dataPoint.Y) === payload.leftADIVal ||
                   parseFloat(annotation.dataPoint.Y) === payload.rightADIVal);
          }).length > 0) {
            isVisible = true;
          }
          break;
          
        case 'AEI By Band Range':
          if (annotations.filter((annotation) => {
            // Returns strue if there is an annotation at the current point
            return annotation.annotationGraph === 'AEI By Band Range' &&
                   annotation.dataPoint.X === payload.name &&
                   (parseFloat(annotation.dataPoint.Y) === payload.leftBandVal ||
                   parseFloat(annotation.dataPoint.Y) === payload.rightBandVal);
          }).length > 0) {
            isVisible = true;
          }
          break;

        case 'AEI Band Range Values By File':
          break;

        case 'AEI By File':
          if (annotations.filter((annotation) => {
            // Returns strue if there is an annotation at the current point
            return annotation.annotationGraph === 'AEI By File' &&
                   annotation.dataPoint.X === payload.name &&
                   (parseFloat(annotation.dataPoint.Y) === payload.leftAEIVal ||
                   parseFloat(annotation.dataPoint.Y) === payload.rightAEIVal);
          }).length > 0) {
            isVisible = true;
          }
          break;

        case 'AEI By Date And Hour':
          if (annotations.filter((annotation) => {
            // Returns strue if there is an annotation at the current point
            return annotation.annotationGraph === 'AEI By Date And Hour' &&
                   annotation.dataPoint.X === payload.name &&
                   (parseFloat(annotation.dataPoint.Y) === payload.leftAEIVal ||
                   parseFloat(annotation.dataPoint.Y) === payload.rightAEIVal);
          }).length > 0) {
            isVisible = true;
          }
          break;
        
        case 'Bioacoustic Value By File':
          break;
        case 'Bioacoustic Spectrum Values':
          if (annotations.filter((annotation) => {
            // Returns strue if there is an annotation at the current point
            return annotation.annotationGraph === 'Bioacoustic Spectrum Values' &&
                   parseFloat(annotation.dataPoint.X) === payload.name &&
                   (parseFloat(annotation.dataPoint.Y) === payload.leftSpectrum ||
                   parseFloat(annotation.dataPoint.Y) === payload.rightSpectrum);
          }).length > 0) {
            isVisible = true;
          }
          break;
        case 'Bioacoustic Area Value By File':
          if (annotations.filter((annotation) => {
            // Returns strue if there is an annotation at the current point
            return annotation.annotationGraph === 'Bioacoustic Area Value By File' &&
                   annotation.dataPoint.X === payload.name &&
                   (parseFloat(annotation.dataPoint.Y) === payload.areaL ||
                   parseFloat(annotation.dataPoint.Y) === payload.areaR);
          }).length > 0) {
            isVisible = true;
          }
          break;

        case 'Bioacoustic Area Value By Date And Hour':
          if (annotations.filter((annotation) => {
            // Returns true if there is an annotation at the current point
            return annotation.annotationGraph === 'Bioacoustic Area Value By Date And Hour' &&
                   annotation.dataPoint.X === payload.name &&
                   (parseFloat(annotation.dataPoint.Y) === payload.areaL ||
                   parseFloat(annotation.dataPoint.Y) === payload.areaR);
          }).length > 0) {
            isVisible = true;
          }
          break;

        case 'Sound Types':
          if (annotations.filter((annotation) => {
            // Returns true if there is an annotation at the current point
            return annotation.annotationGraph === 'Sound Types' &&
                   annotation.dataPoint.X === payload.name &&
                   annotation.dataPoint.Y === SoundTypes[payload.soundType] &&
                   parseInt(annotation.dataPoint.startTime) === payload.startTime;
          }).length > 0) {
            isVisible = true;
          }
          break;

        default:
          break;
      }
    }

    

    let visibility = ( isVisible ? "visible" : "hidden" );

    const sideLen = 5;
    let x = cx - sideLen/2;
    let y = cy - sideLen/2;

    if (typeof x !== Number) {
      x = 0;
      visibility = "hidden";
    }

    if (typeof y !== Number) {
      y = 0;
      visibility = "hidden";
    }
    
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