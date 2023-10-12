import React, { useRef, createRef, useEffect } from 'react'
import CanvasStimuli from '../stimuli/CanvasStimuli.js';
import ResponseButton from './ResponseButton.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CNBResponse from '../trials/CNBResponse.js';
import Stimuli from '../stimuli/Stimuli.js';
import CustomComponent from './CustomComponent.js';
import {SimpleKeyboardInstructions} from '../instructions/SimpleKeyboardInstructions.js';
import AudioInstructionsPage from '../instructions/AudioInstructionsPage.js';
import BaseTrials from './BaseTrials.js';
// https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
// https://medium.com/@martin.crabtree/react-creating-an-interactive-canvas-component-e8e88243baf6

export default class CanvasTrials extends BaseTrials
{
	constructor(props)
	{
		super(props);
		var stimuli = new CanvasStimuli(this.props.trials, this.props.content.randomize || false, this.props.content.sampleSize || 1, this.props.content.n || 0, this.props.content.terminate || {incorrect:-1, correct:-1}, this.props.content.obj);
		var index = stimuli.getIndex();
		this.state = {
			index:index,
			startIndex: index,
			trial: this.props.forwardFeedback || this.props.trials[index],
			responses: [],
			starttime: new Date(),
			stimuli: stimuli,
			demo:false,
			feedback: -1
		}

		this.canvasRef = React.createRef();
		this.onMouseMove = this.onMouseMove.bind(this);
		this.update = this.update.bind(this);
		this.feedback = '';
		this.duration = this.props.content.duration || -1;
		this.blank = this.props.content.blank || -1;
		this.showBlank = this.showBlank.bind(this);
		this.nextCanvasTrial = this.nextCanvasTrial.bind(this);
	}

	componentDidMount()
	{
		let canvas = this.canvasRef.current;
		this.canvasSetup();
		this.starttime = new Date();
		this.update();
		this.resetTimers();
	}

	componentWillUnmount()
	{
		this.clearTimeout();
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

	resetTimers()
	{
	}

	/***
	* Load next canvas trial.
	*
	*/
	nextCanvasTrial(callback)
	{

		let stimuli = this.getStimuli();

		this.clearTimeout();

		// Practice block
		if(this.proc === 'practice')
		{
			// False negative, show feedback or demo.
			if(this.responded === false && stimuli.onPracticeResponse(-1) === false)
			{
				this.lastResponse = -1;
				this.feedback = true;
				this.setState((prevState, props) => {return {index: -1, stimuli: stimuli}});
			}
			else
			{
				this.nextTrial();
				if(stimuli.hasNext())
				{
					this.resetTimers();
				}
			}
			this.update();
		}
		// Test block
		else
		{
			console.log("In CanvasTrials onNextCanvasTrials");
			// Log false negative response.
			if(this.responded === false)
			{
				let responses = this.state.responses;
				responses.push(new CNBResponse(this.state.stimuli.qid() + 1, 0, ""));
			}

			this.nextTrial(callback);
			if(stimuli.hasNext())
			{
				this.resetTimers();
				this.update();
			}
		}
	}

	/**
	* Handler for canvas mouse over.
	* @param evt Mouse over event
	/*/
	onMouseMove(evt)
	{
		// Only register hovers on canvas if no response recorded for current trial.
		if(!this.responded)
		{
			var rect = this.canvasRef.current.getBoundingClientRect();
			var coords = {x: evt.clientX - rect.left, y: evt.clientY - rect.top};
			var hovered = this.state.stimuli.onMouseMove(coords);
			if(hovered)
			{
				this.canvasRef.current.style.cursor = "pointer";
			}
			else
			{
				this.canvasRef.current.style.cursor = "auto";
			}
			this.update();
		}
	}



	clearFeedback()
	{
		this.nextCanvasTrial();
	}

	resumePractice()
	{
		this.feedback = false;
		this.responded = false;
		let stimuli = this.getStimuli();
		if(stimuli.discontinueTest(this.lastResponse))
		{
			// Specifical for gonogo, after practice block finishes the subject may click the back button
			// which will take them to restart the practice, so we need to reset the terminate condition
			if(this.props.content.onErrGoTo)
			{
				let incorrect = this.props.content.terminateBackup;
				let property = "terminate";
				let updateLabel = this.props.content.label;
				let data = {updateLabel: updateLabel, property: property, value: incorrect};
				this.props.updateTrialAndContinue(data);
			}
			this.props.onClick();
		}
		// Specifically for gonogo task, after feedback for incorrect responses, the experiment needs to go back to the begin practice page.
		// We also need to decrement the incorrect value for temrinate condition.
		else if(this.props.content.onErrGoTo)
		{
			let incorrect = stimuli.getRemainingIncorrect();
			let nextLabel = this.props.content.onErrGoTo;
			let property = "terminate";
			let updateLabel = this.props.content.label;
			let data = {updateLabel: updateLabel, nextLabel: nextLabel, property: property, value: incorrect};
			this.props.updateTrialAndContinue(data);
		}
		else
		{
			stimuli.reset();
			let index = stimuli.getIndex();
			this.setState((prevState, props) => {
				return {stimuli: stimuli, index: index}
			});

			this.resetTimers();
			this.canvasSetup();
			this.update();
		}
	}

	/***
	*
	* Update canvas drawings.
	*/
	update()
	{
		if(this.canvasRef.current != null)
		{
			const ctx = this.canvasRef.current.getContext("2d");
			ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
			// Perform the necesary draw updates
			this.state.stimuli.draw(ctx);
		}
	}

	/***
	Clear canvas image to blank.
	*/
	showBlank()
	{
		if(this.canvasRef.current != null)
		{
			let canvas = this.canvasRef.current;
			let ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	}

	showFeedback(feedback)
	{
		if(feedback.type === 'audioinstructions')
		{
			return(
				<AudioInstructionsPage
				showButtons={true}
				{...feedback}
				hideAllButtons={true}
				position="canvas_feedback"
				content={this.props.feedback}
				isFeedback={true}
				responseDevice={this.props.response_type}
				onClick={() => this.keyDown}/>
			);
		}
		return(
			<SimpleKeyboardInstructions {...feedback} responseDevice={this.props.response_type}/>
		);
	}

	renderStimulus()
	{
		let responseButtons = null;

		// Add response buttons if any.
		if(this.props.content.response_type !== 'keyboard')
		{
			if(this.props.content.responses)
			{
				responseButtons = this.renderChoices(this.props.content.responses.items, this.props.content.response_style);
			}
		}

		let hint = null;
		if(this.props.content.hint)
		{
			hint = <CustomComponent content={this.props.content.hint}/>
		}

		return (
			<Container className="canvas_container">
			<canvas ref={this.canvasRef} width="800" height="600" />
			{responseButtons}
			{hint}
			</Container>
		)
	}

}
