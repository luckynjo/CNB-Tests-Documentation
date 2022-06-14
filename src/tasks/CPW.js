import React from 'react';
import {WordMemoryTrials} from '../trials/FaceMemoryTrials.js';
import {SimpleInstructions} from '../instructions/SimpleInstructions.js';
import Slideshow from '../components/Slideshow.js';

export default class CPW extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      index: 0
    }
    this.next = this.next.bind(this);
  }

  next()
  {
    const next = this.state.index + 1;
    if(next >= this.props.timeline.length)
    {

    }
    else
    {
      this.setState((prevState, props) => {
        return {index: next};
      });
    }
  }

  render()
  {
    const index = this.state.index;
    const timelineObject = this.props.timeline[index];

    if(timelineObject.type === "Instructions")
    {
      return <div className="container center"><SimpleInstructions {...timelineObject} /></div>
    }
    else if(timelineObject.type === "Slideshow")
    {
      return <div className="container center"><Slideshow words={this.props.words}  onSlideShowComplete={this.next}/></div>
    }
    else
    {
      return <div className="container center"><WordMemoryTrials trials={this.trials} onTrialsComplete={this.next}/></div>
    }
  }
}
