import React, { Component } from 'react';

class CustomTooltip extends Component {

  render(){
    const { active } = this.props;
    if(active){
      const { payload, label } = this.props;
      if(payload === undefined || payload === null || payload[0] === null || payload[0] === undefined)
      {
        return(
          <div style={{ backgroundColor:'#FFFFFF', padding:8+'px'}}>
            <p>There was an error loading this tooltip. Try reloading the graphs</p>
          </div>
        );
      }else
      {
        return(
          <div style={{ backgroundColor:'#FFFFFF', padding:8+'px'}}>
            <p>{`${label} at ${payload[0].payload.stamp} seconds`}</p>
            <p style={{ color:'#8884d8' }}>{`aciLeft: ${payload[0].value}`}</p>
            <p style={{ color:'#82ca9d' }}>{`aciRight: ${payload[1].value}`}</p>
          </div>
        );
      }

    }
    return null;
  }
}

export default CustomTooltip
