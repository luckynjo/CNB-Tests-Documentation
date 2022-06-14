import React, { useState, useEffect } from 'react';
//import MotorPraxisRect from '../stimuli/MotorPraxisRect.js';
import Canvas from '../components/Canvas.js';
import CNBResponse from './CNBResponse.js';

const scale = {sx: 800/600, sy:600/400};

class MotorPraxisRect
{
	constructor(props, settings)
	{
		var sx = settings.sx || 1;
		var sy = settings.sy || 1;
    this.x = props.x * sx;
    this.y = props.y * sy;
		this.w = props.w * sx;
		this.h = props.h * sy;
		this.response = props.response || null;
	}

	init()
	{

	}

	draw(ctx)
	{
    ctx.fillStyle = "#009900";
    ctx.strokeStyle = "#009900";
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.w, this.h);
		ctx.stroke();
		ctx.fill();
	}

	onMouseMove(data)
	{

		let x1 = this.x;
		let y1 = this.y;
		let x2 = this.x + this.w;
		let y2 = this.y + this.h;

		return (data.x >= x1 && data.x <= x2 && data.y >= y1 && data.y <= y2);
	}

	onResponse(data)
	{
		return this.onMouseMove(data);
	}
}

export class MotorPraxisTrials extends React.Component{

  constructor(props)
  {
    super(props);
    const stimulus = new MotorPraxisRect(JSON.parse(props.trials[0].stimulus), scale);
    this.state = {
      trial: 0,
      stimulus: stimulus,
      responses: []
    };
    this.hint = JSON.parse(this.props.content)[0];
    this.timeoutId = -1;
    this.trialTime = new Date();
    // Method bindings
    this.onClick = this.onClick.bind(this);
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
    this.responded = false;
    if(!this.props.practice)
    {
      this.timeoutId = setTimeout(() => {this.update();}, 196);
    }
  }

  update()
  {
    const duration = (new Date()) - this.trialTime;
    //console.log(this.state.trial, ', ', duration)
    // Show next trial
    if(duration < 5000)
    {
      this.timeoutId = setTimeout(() => {this.update();}, 196);
    }
    else
    {
      clearTimeout(this.timeoutId);
      this.nextTrial(false);
    }
  }

  stop()
  {
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
    this.trialTime = null;
    this.responded = false;
  }

  onClick(valid_response)
  {
    // User has already responded.
    if(this.responded)
    {
      return;
    }
    // Not a valid press ie pressed outside the green box.
    if(!valid_response)
    {
      return ;
    }
    this.responded = true;
    this.nextTrial(this.responded);
  }

  nextTrial(responded)
  {
    const next_trial = this.state.trial + 1;
    const trial_count = this.props.trials.length;
    const trial_response = JSON.parse(this.props.trials[this.state.trial].responses)[0];

    const rt = new Date() - this.trialTime;
    const response = new CNBResponse(this.props.trials[this.state.trial].question_number, trial_response, responded ? rt : 5000);
    let responses = this.state.responses;
    responses.push(response);
    this.stop();
    if(next_trial < trial_count)
    {
      const stimulus = new MotorPraxisRect(JSON.parse(this.props.trials[next_trial].stimulus), scale);
      this.setState((prevState, props) => {
        return {trial: next_trial, stimulus: stimulus, responses: responses};
      }, this.start);
    }
    else
    {
      this.props.onTrialsComplete(responses);
    }
  }

  render()
  {
    const hint = this.hint;
    return (
      <div className="canvas_container">
      <Canvas stimulus={this.state.stimulus} clickHandler={this.onClick} trial={this.state.trial}/>
      <p className="canvas--hint">{hint}</p>
      </div>
    )
  }
}
