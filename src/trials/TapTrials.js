import React, { useState, useEffect } from 'react';
import {Paragraph} from '../components/Paragraph.js';
import CNBResponse from './CNBResponse.js';

export class TapTrials extends React.Component{


  constructor(props)
  {
    super(props);
    this.state = {
      goCount: 0,
      stopCount: 0,
      trialTime: null,
      stimulus: this.props.goText
    }
    this.keyDown = this.keyDown.bind(this);
    this.update = this.update.bind(this);
    this.onTestResponse = this.onTestResponse.bind(this);
    this.stimDuration = this.props.practice ? 5000 : 10000;
    this.testDuration = this.props.practice ? 10000 : 15000;
  }

  componentDidMount()
  {
    window.addEventListener("keydown", this.keyDown, false);
    this.start();
  }

  componentWillUnmount()
  {
    this.stop();
    window.removeEventListener("keydown", this.keyDown, false);
  }

  updateGoCount()
  {
    const goCount = this.state.goCount + 1;
    const trialTime = new Date();
    if(goCount === 1)
    {
      this.setState((prevState, props) => {
        return {goCount: goCount, trialTime: trialTime}
      });
    }
    else
    {
      this.setState((prevState, props) => {
        return {goCount: goCount}
      });
    }
  }

  updateStopCount()
  {
    const stopCount = this.state.stopCount + 1;
    this.setState((prevState, props) => {
      return {stopCount: stopCount}
    });
  }

  keyDown(e)
  {
    if(e.keyCode !== 32)
    {
      return;
    }
    else if(this.props.practice)
    {
      this.onPracticeResponse(e);
    }
    else
    {
      this.onTestResponse(e);
    }
  }

  onPracticeResponse(e)
  {
    if(e.keyCode === 32)
    {
      const goCount = this.state.goCount;
      if(goCount === 0)
      {
        this.updateGoCount();
      }
    }
  }

  onTestResponse(e)
  {
    if(e.keyCode === 32)
    {
      const stim = this.state.stimulus;

      if(stim === this.props.stopText)
      {
        this.updateStopCount();
      }
      else
      {
        this.updateGoCount();
      }
    }
  }

  start()
  {
    this.intervalid = setTimeout(() => {this.update();}, 256);
  }

  update()
  {
    const starttime = this.state.trialTime;

    const duration = (new Date()) - starttime;
    if(!starttime)
    {
      this.intervalid = setTimeout(() => {this.update();}, 32);
    }
    else if(duration >= this.testDuration)
    {
      this.nextTrial();
    }
    else if(duration >= this.stimDuration)
    {
      if(this.state.stimulus !== this.props.stopText)
      {
        this.setState((prevState, props) => {
          return {stimulus: this.props.stopText}
        });
      }
      this.intervalid = setTimeout(() => {this.update();}, 256);
    }
    else
    {
      this.intervalid = setTimeout(() => {this.update();}, 256);
    }
  }

  stop()
  {
    clearTimeout(this.intervalid);
    this.intervalid = null;
  }

  nextTrial()
  {
    this.stop();
    if(this.props.practice)
    {
      this.props.onPracticeComplete();
    }
    else
    {
      let responses = [];
      const index = this.props.index;
      const qid = this.props.trials[index].question_number;
      responses.push(new CNBResponse(qid, this.state.goCount, ""));
      // Add number of excess taps
      responses.push(new CNBResponse(qid + 6, this.state.stopCount, ""));

      this.props.onTrialsComplete(responses);
    }
  }

  render()
  {
    const word = this.state.stimulus;
    const additional_class = word === this.props.stopText ? "stop" : "go";
    return (
      <div className="container center">
      <p className={additional_class + " text-center"}>{word}</p>
      </div>
    );
  }
}
