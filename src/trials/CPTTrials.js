import React, { useState, useEffect } from 'react';
import StaticCanvas from '../components/StaticCanvas.js';
import CPTStimulus from '../stimuli/CPTStimulus.js';
import {TableInstructions} from '../instructions/TableInstructions.js';
import {Randomizer} from '../utils/Randomizer.js';
import CNBResponse from './CNBResponse.js';


const TRIAL_DURATION = 1000;
const STIM_DURATION = 300;
const RESPONSE_NOT_ALLOWED = -2;
const START = 0;
const STIM = 1;
const ISI = 2;
const STOPPED = 3;
const FEEDBACK = 4;

export class CPTTrials extends React.Component
{
  constructor(props)
  {
    super(props);
    const questions = Randomizer(this.props.trials, props.practice ? 3 : 5, true);
    const index = 0;
    const trial = questions[index];
    const stimulus = new CPTStimulus(this.findImage(this.props.trials[trial].stimulus));

    this.state = {
      index:index,
      stimulus: stimulus,
      questions: questions,
      starttime: new Date(),
      responses: []
    }

    this.taskStart = new Date();
    this.canvasRef = React.createRef();
    this.keyDown = this.keyDown.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerCancel = this.onPointerCancel.bind(this);
    this.update = this.update.bind(this);

    this.nextTestSlide = this.nextTestSlide.bind(this);
    this.nextPracticeSlide = this.nextPracticeSlide.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.duration = 1000;
    this.correct = 0;

    this.addClickStyle = this.addClickStyle.bind(this);
    this.removeClickStyle = this.removeClickStyle.bind(this);
    this.visualFeedbackTimeout = -1;
  }

  componentDidMount()
  {
    window.addEventListener("keydown", this.keyDown, false);
    if(this.props.response_device !== "keyboard")
    {
        window.addEventListener("click", this.onClick, false);
        window.addEventListener("pointerdown", this.onPointerDown, false);
        window.addEventListener("pointerup", this.onPointerUp, false);
        window.addEventListener("pointercancel", this.onPointerCancel, false);
    }
    this.canvasSetup();
    this.trialStart = new Date();
    this.start();
  }

  canvasSetup()
  {
    let canvas = this.canvasRef.current;
    // Canvas text appears blurry, we fix here
    // https://medium.com/wdstack/fixing-html5-2d-canvas-blur-8ebe27db07da
    if(canvas != null)
    {
      canvas.width = 1600;
      canvas.height = 1200;
      canvas.style.width = "800px";
      canvas.style.height = "600px";
      canvas.getContext('2d').scale(2,2);
    }
  }

  start()
  {
    this.responded = false;
    this.task = START;
    this.trialTimeStamp = null;
    this.stimDrawCount = 0;
    this.isiDrawCount = 0;
    this.lastResponse = "";
    this.allow_responses = 1;
    this.update();
  }

  componentDidUpdate()
  {
    this.draw();
  }

  stop()
  {
    cancelAnimationFrame(this.refID);
    this.trialTimeStamp = null;
    this.stimDrawCount = 0;
    this.isiDrawCount = 0;
    this.task = STOPPED;
  }

  componentWillUnmount()
  {
    this.stop();
    window.removeEventListener("keydown", this.keyDown, false);
    if(this.props.response_device !== "keyboard")
    {
        this.removeClickStyle();
        window.removeEventListener("click", this.onClick, false);
        clearTimeout(this.visualFeedbackTimeout);
        window.removeEventListener("pointerdown", this.onPointerDown, false);
        window.removeEventListener("pointerup", this.onPointerUp, false);
        window.removeEventListener("pointercancel", this.onPointerCancel, false);
    }
  }

  onClick(e)
  {
    if(this.allow_responses === RESPONSE_NOT_ALLOWED)
    {
      return;
    }
    if(this.props.practice)
    {
      this.onPracticeResponse(e);
    }
    else
    {
      this.onTestResponse(e);
    }
  }

  onPointerDown(e)
  {
      if (this.props.test.includes("xf")) {
          return;
      }
      this.addClickStyle();
  }

  onPointerCancel()
  {
      if (this.props.test.includes("xf")) {
          return;
      }
      this.removeClickStyle();
  }

  onPointerUp(e)
  {
      if (this.props.test.includes("xf")) {
          return;
      }
      this.visualFeedbackTimeout = setTimeout(this.removeClickStyle, 64);
  }

  addClickStyle()
  {
      const frame = document.querySelector(".frame");
      if (!frame.classList.contains("cpt-trial--click"))
      {
          console.log("added");
          frame.classList.add("cpt-trial--click");
      }
  }

  removeClickStyle()
  {
      const frame = document.querySelector(".frame");
      if (frame.classList.contains("cpt-trial--click")) {
          console.log("removed");
          frame.classList.remove("cpt-trial--click");
      }
  }


  update(timestamp)
  {
    if(!this.trialTimeStamp)
    {
      if(this.draw())
      {
        this.trialTimeStamp = timestamp;
        this.task = STIM;
      }
      else
      {
        this.trialTimeStamp = null;
        this.task = START;
      }
    }

    if(this.task === START)
    {
      if(this.draw())
      {
        this.trialTimeStamp = timestamp;
        this.task = STIM;
      }
    }

    const duration = timestamp - this.trialTimeStamp;
    if(this.task === STIM)
    {
      if(duration >= 300)
      {
        this.task = ISI;
      }
      this.draw();
      this.refID = requestAnimationFrame(this.update);
    }
    else if(this.task === ISI)
    {
      if(duration >= 1000)
      {
        this.task = STOPPED;
        this.stop();
        this.nextSlide();
      }
      else
      {
        this.draw();
        this.refID = requestAnimationFrame(this.update);
      }
    }
  }

  draw()
  {
    const ctx = this.canvasRef.current.getContext("2d");
    if(this.task === STIM || this.task === START)
    {
      this.state.stimulus.draw(ctx);
      this.stimDrawCount++;
      return true;
    }
    else
    {
      ctx.clearRect(0,0, 800, 600);
      return false;
    }
  }



  keyDown(e)
  {
    //this.log_event('keyDown ' + e.keyCode, new Date());
    // TO DO: Add error sound for invalid key presses
    if(this.allow_responses === RESPONSE_NOT_ALLOWED)
    {
      return;
    }
    else if(e.keyCode !== 32)
    {
      return;
    }
    if(this.props.practice)
    {
      this.onPracticeResponse(e);
    }
    else
    {
      this.onTestResponse(e);
    }
  }

  /**
  * Handle response to practice question.
  * @param {event} e The keyboard keydown event.
  */
  onPracticeResponse(e)
  {
    this.responded = true;
    const questions = this.state.questions;
    const index = this.state.index;
    const trial = this.props.trials[questions[index]];
    if(!trial.correct_response)
    {
      this.stop();
      window.removeEventListener("keydown", this.keyDown, false);
      if(this.props.response_device !== "keyboard")
      {
          this.removeClickStyle();
          window.removeEventListener("click", this.onClick, false);
          window.removeEventListener("pointerdown", this.onPointerDown, false);
          window.removeEventListener("pointerup", this.onPointerUp, false);
          window.removeEventListener("pointercancel", this.onPointerCancel, false);
      }
      this.correct = 0;
      this.props.onPracticeFailed("False_Positive");
    }

    this.correct = this.correct + 1;
    if(this.correct === 3)
    {
      this.stop();
      this.props.onPracticeComplete();
    }
  }


  onTestResponse(e)
  {
    this.feedback = false;
    if(!this.responded)
    {
      this.responded = true;
      this.lastResponse = e.keyCode;
      const duration = new Date() - this.state.starttime;
      const questions = this.state.questions;
      const index = this.state.index;
      const trial = this.props.trials[questions[index]];
      //console.log('Recording response for question ', trial.question_number);
      let responses = this.state.responses;
      // Must deal with question id here somehow
      responses.push(new CNBResponse(trial.question_number, 1, duration));
      this.setState((prevState, props) => {
        return {responses: responses};
      });
    }
  }

  nextSlide()
  {
    //console.log('responses ', this.responses.length);
    if(this.props.practice)
    {
      this.nextPracticeSlide();
    }
    else
    {
      this.nextTestSlide();
    }
  }

  nextTestSlide()
  {
    this.stop();
    if(this.responded === false)
    {
      const duration = new Date() - this.state.starttime;
      const questions = this.state.questions;
      const index = this.state.index;
      const trial = this.props.trials[questions[index]];
      //console.log('Recording response for question ', trial.question_number);
      let responses = this.state.responses;
      responses.push(new CNBResponse(trial.question_number, 0, ""));
      this.setState((prevState, props) => {
        return {responses: responses};
      }, this.nextTrial);
    }
    else
    {
      this.nextTrial();
    }
  }

  nextPracticeSlide()
  {
    this.stop();
    const questions = this.state.questions;
    const index = this.state.index;
    const trial = this.props.trials[questions[index]];
    if(trial.correct_response && !this.responded)
    {
      this.stop();
      this.correct = 0;
      window.removeEventListener("keydown", this.keyDown, false);
      if(this.props.response_device !== "keyboard")
      {
          this.removeClickStyle();
          window.removeEventListener("click", this.onClick, false);
          window.removeEventListener("pointerdown", this.onPointerDown, false);
          window.removeEventListener("pointerup", this.onPointerUp, false);
          window.removeEventListener("pointercancel", this.onPointerCancel, false);
      }
      this.props.onPracticeFailed("False_Negative");
    }
    else
    {
      this.nextTrial();
    }
  }

  /***
  * Load next trial
  *
  */
  nextTrial()
  {

    const questions = this.state.questions;
    const next_index = this.state.index + 1;
    const trial_count = questions.length;
    this.stop();

    if(next_index < trial_count)
    {
      const stimulus = new CPTStimulus(this.findImage(this.props.trials[questions[next_index]].stimulus));
      this.setState((prevState, props) => {
        return {index: next_index, stimulus: stimulus, starttime: new Date()};
      }, this.start);
    }
    else
    {
      this.props.onTrialsComplete(this.state.responses);
    }
  }

  findImage(image_url)
  {
    const clean_url = JSON.parse(image_url);
    if(this.props.images)
    {
      return this.findAssetFile(clean_url);
    }
    else return this.props.base_url + "stimuli/cpt/" + clean_url;
  }

  findAssetFile(url)
  {
    let file = localStorage.getItem(url);
    if(!file)
    {
      file = this.findAssetFileInArray(url);
    }
    return file;
  }

  findAssetFileInArray(url)
  {
    //console.log('image url ', url);
    let file = null;
    const assets = this.props.images || [];
    //console.log('Assets ', assets);
    for(let i=0; i < assets.length; i++)
    {
      if((assets[i].url).includes(url))
      {
        file = assets[i].data;
        //console.log('For url ', url, ' we have image data ', file);
        continue;
      }
    }
    return file || this.props.base_url + "stimuli/cpt/" + url;
  }

  render()
  {
    return(
      <div className="container canvas_container">
      <canvas ref={this.canvasRef} width="800" height="600" />
      </div>
    );
  }
}
