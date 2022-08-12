import React, { useState, useEffect } from 'react';
import {Paragraph} from '../components/Paragraph.js';
import CNBResponse from './CNBResponse.js';

export class WordMemoryTrials extends React.Component{

  constructor(props)
  {
    super(props);
    const stimulus = JSON.parse(this.props.trials[0].stimulus);
    this.state = {
      trial: 0,
      word: stimulus,
      responses: [],
      trialTime: new Date()
    };
    this.intervalid = -1;
    this.trialTime = new Date();
    // Method bindings
    this.onClick = this.onClick.bind(this);
    this.nextTrial = this.nextTrial.bind(this);
  }

  onClick(evt, response)
  {
    let responses = this.state.responses;
    const duration = (new Date()) - this.state.trialTime;
    responses.push(new CNBResponse(this.state.trial + 1, response, duration));
    this.nextTrial(responses);
  }

  nextTrial(responses)
  {
    const next_trial = this.state.trial + 1;
    const trial_count = this.props.trials.length;
    const rt = new Date() - this.trialTime;
    if(next_trial < trial_count)
    {
      const stimulus = JSON.parse(this.props.trials[next_trial].stimulus);
      this.setState((prevState, props) => {
        return {trial: next_trial, word: stimulus};
      }, this.start);
    }
    else
    {
      this.props.onTrialsComplete(responses);
    }
  }

  render()
  {
    const word = this.state.word;
    const buttons = this.props.buttons.map((item, index) => {
      return (<button className="button memory-button" key={index + 155} onClick={(e) => this.onClick(e, index + 1)}>{item}</button>)
    })
    return (
      <div className="container">

      <div className="stimulus--cpw center">
       <Paragraph text={word} classList="stimulus-text--medium text-center" />
      </div>

      <div className='inline memory-buttons--test'>
      {buttons}
      </div>

      </div>
    );
  }
}
