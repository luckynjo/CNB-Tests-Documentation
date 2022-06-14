import React, { useRef, createRef, useEffect } from 'react'
import {Randomizer} from '../utils/Randomizer.js';
import CNBResponse from './CNBResponse.js';
import NBackStimulus from '../stimulus/NBackStimulus.js';
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
		const questions = Randomizer(this.props.trials, 1, true);
    const index = 0;
    const trial = questions[index];
		const stimulus = new NBackStimulus(this.findImage(this.props.trials[trial].stimulus));
    console.log('Given images ', props.images);
    console.log('Given questions ', questions);

		super(props);
		this.state = {
			index:index,
			startIndex: index,
			stimulus: stimulus,
      demo: false,
			starttime: new Date(),
			questions: questions,
			responses: []
		}

    // Function bindings
    this.keyDown = this.keyDown.bind(this);
    this.restartPractice = this.restartPractice.bind(this);
    this.update = this.update.bind(this);

    this.trialTimeStamp = null;

    // Stimuli
		this.canvasRef = React.createRef();
		this.refID = null;
		this.stimDrawCount = 0;
		this.isiDrawCount = 0;

	}

	componentDidMount()
	{
		window.addEventListener("keydown", this.keyDown, false);
		this.canvasSetup();
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
		this.trialTime = new Date();
		this.task = START;
		this.trialTimeStamp = null;
		this.stimDrawCount = 0;
		this.isiDrawCount = 0;
		this.lastResponse = "";
		this.clearCanvas();
		this.allow_responses = 1;
		this.update();
	}

	componentDidUpdate()
	{
		this.draw();
	}

	stop()
	{
		//console.log('current state ', this.state);
		this.clearCanvas();
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

		const duration = timestamp - this.trialTimeStamp;

		if(this.task === START)
		{
			if(this.draw())
			{
				this.trialTimeStamp = timestamp;
				this.task = STIM;
			}
		}
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
			if(duration >= 2500)
			{
				this.task = STOPPED;
				this.stop();
				this.nextSlide();
			}
			else
			{
				this.clearCanvas();
				this.refID = requestAnimationFrame(this.update);
			}
		}
	}

	clearCanvas()
	{
		if(this.canvasRef.current != null)
		{
			const ctx = this.canvasRef.current.getContext("2d");
			ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
			this.isiDrawCount++;
			return true;
		}
		return false;
	}

	draw()
	{
		if(this.canvasRef.current === null)
		{
			return false;
		}
    else if(this.task === FEEDBACK)
    {
      this.clearCanvas();
      return false;
    }

		this.clearCanvas();
		const ctx = this.canvasRef.current.getContext("2d");
		if(this.task === STIM || this.task === START)
		{
			this.stimuli.draw(ctx);
			this.stimDrawCount++;
			return true;
		}
		return false;
	}

	render()
	{
		/***
		{this.feedback && this.showFeedback(this.state.trial)}
		{this.state.demo && <LNBDemo content={this.props.feedback.demo} onContinue={this.restartPractice} goBack={this.restartPractice}/>}
		*/
		return(
			<Container className="canvas_container">

			<canvas ref={this.canvasRef} width="800" height="600" />
			</Container>
		);
	}

	showFeedback(feedback)
	{
		// voice over nback and lnb use an audio slider for part of their feedback
		/***if(feedback.type === 'audioslider')
		{
			return <AudioSlider {...feedback} callback={() => this.restartPractice()} continue={this.props.continue || this.props.continue} keypic_src={this.props.keypic_src}/>
		}
		else
		{
			return(
				<KeyboardInstructions
					{...feedback}
					instructions={feedback}
					responseDevice={this.props.response_type}
					keypic_src={this.props.keypic_src}
					continue={this.props.continue || this.props.continue}
				/>
			);
		}*/
	}

	keyDown(e)
	{
		// TO DO: Add error sound for invalid key presses
		if(this.allow_responses === RESPONSE_NOT_ALLOWED)
		{
			return;
		}
    else if(this.state.demo === true)
    {
      return;
    }
		else if(e.keyCode !== 32)
		{
			return;
		}
		/***if(this.feedback === true)
		{
			this.stop();
			//this.restartPractice();
      this.feedback = false;
      this.responded = false;
      // For practice tests that discontinue after certain number of attempts, discontinue practice.
      if(this.discontinue)
      {
        this.props.onPracticeComplete();
      }
      else if(this.props.feedback.demo)
      {
        this.clearCanvas();
        this.setState((prevState, props) => {return {index:-1, trial: null, demo: true}});
      }
      else
      {
        this.restartPractice();
      }
		}
		else */
		if(this.props.proc === 'test')
		{
			this.onTestResponse(e);
		}
		else if(this.props.proc === 'practice')
		{
			this.onPracticeResponse(e);
		}
	}

	/**
	* Handle response to practice question.
	* @param {event} e The keyboard keydown event.
	*/
	onPracticeResponse(e)
	{
		if(this.responded)
		{
			return;
		}
		this.lastResponse = e.keyCode;

		// For practices that end after a certain number of responses.
		/***if(this.stimuli.discontinueTest(e.keyCode))
		{
				this.discontinue = true;
		}
		// Note that a response has been recorded for the practice.
		else */
		if(e.keyCode === this.state.trial.correct)
		{
			this.responded = true;
		}
		else
		{
			this.stop();
			this.props.onPracticeFailed("False_Positive");
			// False positive, show feeback and possibly a demo if any.
			/***this.responded = true;
			this.feedback = true;
			this.stop();
			this.stimuli.reset();
			let index = -1;
			let nexttrial = this.props.feedback.incorrect2;
			this.setState((prevState, props) => {return {index:index, trial: nexttrial}});*/
		}
	}

	/**
	* Restart a practice task after incorrect responses.
	*/
	restartPractice()
	{
    if(this.discontinue)
    {
      this.props.onClick();
    }
    else if(this.props.onErrGoTo)
		{
      const log = this.event_log;
			// Data to update the practice object in case the user presses the back button to return to the practice.
			const incorrect = this.stimuli.getRemainingIncorrect();
			const nextLabel = this.props.onErrGoTo;
			const property = "terminate";
			const updateLabel = this.props.label;
			const data = {updateLabel: updateLabel, nextLabel: nextLabel, property: property, value: incorrect, log: log};
			this.props.updateTrialAndContinue(data);
		}
    else
    {
      this.stimuli.reset();
      const index = this.stimuli.getIndex();
			this.feedback = false;
			this.responded = false;
      this.setState((prevState, props) => {return {index: index, trial: this.props.trials[index]}}, this.resumePracticeAfterDelay);
    }
	}

	resumePracticeAfterDelay()
	{
		this.allow_responses = RESPONSE_NOT_ALLOWED;
		this.clearCanvas();
		setTimeout(() => {this.start()}, 250);
	}


	onTestResponse(e)
	{
		this.feedback = false;
		if(e.keyCode === 32 && !this.responded)
		{
			this.responded = true;
			this.lastResponse = e.keyCode;
			const duration = new Date() - this.state.starttime;
			// Must deal with question id here somehow
			this.responses.push(new CNBResponse(this.stimuli.qid() + 1, 1, duration));
		}
	}

	nextSlide()
	{
		//console.log('responses ', this.responses.length);
		if(this.props.proc === 'test')
		{
			this.nextTestSlide();
		}
		else
		{
			this.nextPracticeSlide();
		}
	}

	nextTestSlide()
	{
		this.stop();
		if(this.responded === false)
		{
			this.responses.push(new CNBResponse(this.stimuli.qid() + 1, 0, ""));
		}
		this.nextTrial();
	}

	nextPracticeSlide()
	{
    this.stop();
		// Got all responses correct, end nback practice.
		if(this.discontinue)
		{
			this.props.onClick();
		}
		// False negative, show feedback.
		else if(this.responded === false && this.props.trials[this.state.questions[this.state.index]].correct_response)
		{
			/***this.lastResponse = "";
      this.feedback = true;
      let nexttrial = this.props.feedback.incorrect1;
      this.discontune = this.stimuli.discontinueTest(this.lastResponse);
      this.setState((prevState, props) => {return {trial: nexttrial}});*/
			this.stop();
			this.props.onPracticeFailed("False_Negative");
		}
		// Correct response, load next practice trial.
		else
		{
			this.responded = false;
			this.nextTrial();
		}
	}

	/***
	* Load next trial
	*
	*/
	nextTrial()
	{
		const next = this.state.index + 1;
		const question_count = this.state.questions.length;
		// Has not reached end of block, load next trial.
		if(next < question_count)
		{
			const trial = questions[next];
			const stimulus = new new NBackStimulus(this.findImage(this.props.trials[trial].stimulus));
			this.responded = false;
			this.setState((prevState, props) => {
				return {
				index: next,
				stimulus: stimulus,
				starttime: new Date()
			}}, this.start);
		}
		else if(this.props.practice)
		{
			this.props.onPracticeComplete();
		}
		else
		{
			this.props.onTrialsComplete(this.state.responses);
		}
	}

	findImage(image_url)
	{
		const clean_url = JSON.parse(image_url);
		if(!image_url.match(IMG_REGEX))
		{
			return clean_url;
		}
		else if(this.props.images)
		{
			return this.findAssetFile(clean_url);
		}
		else return "http://localhost/stimuli/nback/" + clean_url;
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
				console.log('For url ', url, ' we have image data ', file);
				continue;
			}
		}
		return file || "http://localhost/stimuli/nback/" + url;
	}
}
