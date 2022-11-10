import React from 'react';
import {Paragraph} from './Paragraph.js';

export default class CPWSlideshow extends React.Component{
  constructor(props)
  {
    super(props);
    const word = props.instructions[1];
    this.state = {
      trial: 0,
      word: word,
    };
    this.intervalid = -1;
    this.trialTime = new Date();
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
    // Show next trial
    if(duration >= 5000)
    {
      this.next();
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

  next()
  {
    const nextSlide = this.state.trial + 1;
    const trial_count = this.props.words.length;
    const rt = new Date() - this.trialTime;
    this.stop();
    if(nextSlide < trial_count)
    {
      const word = this.props.instructions[nextSlide+1];
      this.setState((prevState, props) => {
        return {trial: nextSlide, word: word};
      }, this.start);
    }
    else
    {
      this.props.onSlideShowComplete();
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
