import React, { useState, useEffect } from 'react';
import Paragraph from './Paragraph.js';

export class WordMemoryTrials extends React.Component{

  constructor(props)
  {
    super(props);
    const stimulus = this.props.trials[0];
    this.state = {
      trial: 0,
      stimulus: stimulus,
    };
    this.intervalid = -1;
    this.trialTime = new Date();
    // Method bindings
    this.onClick = this.onClick.bind(this);
    this.responses = [];
  }

  componentDidMount()
  {
    this.start();
  }

  componentWillUnmount()
  {
    this.stop();
  }

  start()
  {
    this.trialTime = new Date();
    this.intervalid = setTimeout(() => {this.update();}, 34);
  }

  update()
  {
    const duration = (new Date()) - this.trialTime;
    //console.log(this.state.trial, ', ', duration)
    // Show next trial
    if(duration >= 10000)
    {
      this.nextTrial();
    }
    else {
      this.intervalid = setTimeout(() => {this.update();}, 34);
    }
  }

  stop()
  {
    clearTimeout(this.intervalid);
    this.intervalid = null;
    this.trialTime = null;
  }

  onClick(valid_response)
  {
    if(!valid_response)
    {
      return ;
    }
    this.nextTrial();
  }

  nextTrial()
  {
    const next_trial = this.state.trial + 1;
    const trial_count = this.props.trials.length;
    const rt = new Date() - this.trialTime;
    this.stop();
    if(next_trial < trial_count)
    {
      const stimulus = this.props.trials[next_trial];;
      this.setState((prevState, props) => {
        return {trial: next_trial, stimulus: stimulus};
      }, this.start);
    }
    else
    {
      this.props.onTrialsComplete({responses: this.responses});
    }
  }

  render()
  {
    const word = this.state.word;
    return (
      <Paragraph text={word} classList="stimulus-text--medium text-center" />
    );
  }
}
