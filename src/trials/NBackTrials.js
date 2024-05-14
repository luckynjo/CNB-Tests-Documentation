import React, { useRef, createRef, useEffect } from 'react'
import {Randomizer} from '../utils/Randomizer.js';
import CNBResponse from './CNBResponse.js';
import NBackStimulus from '../stimuli/NBackStimulus.js';
// https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
// https://medium.com/@martin.crabtree/react-creating-an-interactive-canvas-component-e8e88243baf6


const RESPONSE_NOT_ALLOWED = -2;
const START = 0;
const STIM = 1;
const ISI = 2;
const STOPPED = 3;
const FEEDBACK = 4;
const IMG_REGEX = /\.?(png|gif|jpe?g)/ig;

export default class NBackTrials extends React.Component
{
  constructor(props)
  {
    super(props);
    const trials = props.trials.filter(trial => trial.trial_section === props.section_type);
    const index = 0;
    const stimulus = new NBackStimulus(this.findImage(trials[index].stimulus));

    this.state = {
      index:index,
      stimulus: stimulus,
      starttime: new Date(),
      trials: trials,
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
    this.duration = 2500;
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
        const frame = document.querySelector(".frame");
        if (frame) {
            frame.classList.add("nback");
            frame.focus();
        }
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
        window.removeEventListener("click", this.onClick, false);
        clearTimeout(this.visualFeedbackTimeout);
        window.removeEventListener("pointerdown", this.onPointerDown, false);
        window.removeEventListener("pointerup", this.onPointerUp, false);
        window.removeEventListener("pointercancel", this.onPointerCancel, false);
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
      if(duration >= 500)
      {
        this.task = ISI;
      }
      this.draw();
      this.refID = requestAnimationFrame(this.update);
    }
    else if(this.task === ISI)
    {
      if(duration >= this.duration)
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
      this.addClickStyle();
  }

  onPointerCancel()
  {
      this.removeClickStyle();
  }

  onPointerUp(e)
  {
      this.visualFeedbackTimeout = setTimeout(this.removeClickStyle, 64);
  }

  addClickStyle()
  {
      const frame = document.querySelector(".frame");
      if (!frame.classList.contains("nback-trial--click"))
      {
          frame.classList.add("nback-trial--click");
      }
  }

  removeClickStyle()
  {
      const frame = document.querySelector(".frame");
      if (frame.classList.contains("nback-trial--click")) {
          frame.classList.remove("nback-trial--click");
      }
  }

  /**
  * Handle response to practice question.
  * @param {event} e The keyboard keydown event.
  */
  onPracticeResponse(e)
  {
    this.responded = true;
    const index = this.state.index;
    const trial = this.state.trials[index];
    if(!trial.correct_response)
    {
      this.stop();
      window.removeEventListener("keydown", this.keyDown, false);
      if(this.props.response_device !== "keyboard")
      {
          const frame = document.querySelector(".frame");
          if (frame) {
              frame.classList.remove("nback");
          }
          window.removeEventListener("click", this.onClick, false);
          window.removeEventListener("pointerdown", this.onPointerDown, false);
          window.removeEventListener("pointerup", this.onPointerUp, false);
          window.removeEventListener("pointercancel", this.onPointerCancel, false);
      }
      this.correct = 0;
      this.props.onPracticeFailed("False_Positive", this.props.section_type);
    }

    this.correct = this.correct + 1;
    /**if(this.correct === 3)
    {
      this.stop();
      this.props.onPracticeComplete();
    }*/
  }


  onTestResponse(e)
  {
    this.feedback = false;
    if(!this.responded)
    {
      this.responded = true;
      this.lastResponse = e.keyCode;
      const duration = new Date() - this.state.starttime;
      const index = this.state.index;
      const trial = this.state.trials[index];
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
      const index = this.state.index;
      const trial = this.state.trials[index];
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
    const index = this.state.index;
    const trial = this.state.trials[index];
    if(trial.correct_response && !this.responded)
    {
      this.stop();
      this.correct = 0;
      window.removeEventListener("keydown", this.keyDown, false);
      if(this.props.response_device !== "keyboard")
      {
          window.removeEventListener("click", this.onClick, false);
      }
      this.props.onPracticeFailed("False_Negative", this.props.section_type);
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

    const next_index = this.state.index + 1;
    const trial_count = this.state.trials.length;
    this.stop();

    if(next_index < trial_count)
    {
      const stimulus = new NBackStimulus(this.findImage(this.state.trials[next_index].stimulus));
      this.setState((prevState, props) => {
        return {index: next_index, stimulus: stimulus, starttime: new Date()};
      }, this.start);
    }
    else
    {
      if(this.props.practice)
      {
        this.props.onPracticeComplete();
      }
      else
      {
        this.props.onTrialsComplete(this.state.responses);
      }
    }
  }

  findImage(image_url)
  {
    const clean_url = JSON.parse(image_url);
    if(!clean_url.match(IMG_REGEX))
    {
      return clean_url;
    }

    if(this.props.images)
    {
      return this.findAssetFile(clean_url);
    }
    else return this.props.base_url + "stimuli/flnb/" + clean_url;
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
    return file || this.props.base_url + "stimuli/flnb/" + url;
  }

  render()
  {
    return(
      <div className="container canvas_container nback">
      <canvas ref={this.canvasRef} width="800" height="600" />
      </div>
    );
  }
}
