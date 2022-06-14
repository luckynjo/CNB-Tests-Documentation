import React, { useState, useEffect } from 'react';
import CNBResponse from './CNBResponse.js';

export class TapHandednessTrial extends React.Component{

  constructor(props)
  {
    super(props);
    this.state = {
      trialTime: new Date()
    }

    this.onLeftButtonClick = this.onLeftButtonClick.bind(this);
    this.onRightButtonClick = this.onRightButtonClick.bind(this);
  }

  onLeftButtonClick(e)
  {
    let responses = [];
    responses.push(new CNBResponse(1, "L", ""));
    this.props.onTrialsComplete(responses);
  }

  onRightButtonClick(e)
  {
    let responses = [];
    responses.push(new CNBResponse(1, "R", ""));
    this.props.onTrialsComplete(responses);
  }

  render()
  {

    return (
      <>
      <div className="page">

      <div className="instructions top container">
      {this.props.instructions.map((item, index) => {
        if(!item.includes("HANDEDNESS") && index < this.props.instructions.length - 3){
          return <div key={index + 100}><p>{item}</p><br/></div>
        }
      })}
      </div>

      </div>

      <div className="position--bottom-abosolute">
      <div className="button-like text--center">{this.props.instructions[this.props.instructions.length - 3] || 'Use the mouse to select your writing hand.'}</div>
      <div className="inline">
      <div className="button handedness-button left" onClick={this.onLeftButtonClick}>{this.props.instructions[this.props.instructions.length -2].replace("<HANDEDNESS>", "")}</div>
      <div className="button handedness-button right" onClick={this.onRightButtonClick}>{this.props.instructions[this.props.instructions.length -1].replace("<HANDEDNESS>", "")}</div>
      </div>

      </div>
      </>
    );
  }
}
