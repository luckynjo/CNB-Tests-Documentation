import React, { useRef, createRef, useEffect } from 'react'
import ResponseButton from '../components/ResponseButton.js';
import Container from 'react-bootstrap/Container';
import CustomComponent from '../components/CustomComponent.js';
import {SimpleKeyboardInstructions} from '../instructions/SimpleKeyboardInstructions.js';
import AudioInstructionsPage from '../instructions/AudioInstructionsPage.js';
import CanvasTrials from '../components/CanvasTrials.js';
import AudioPlayer from '../utils/AudioPlayer.js';
// https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
// https://medium.com/@martin.crabtree/react-creating-an-interactive-canvas-component-e8e88243baf6

export default class PlotCanvasTrials extends CanvasTrials
{
	constructor(props)
	{
		super(props);
	}

	componentDidMount()
	{
		super.componentDidMount();
		let buttons = document.getElementsByClassName('button');
		for(let i=0; i < buttons.length; i++)
		{
			buttons[i].addEventListener("click", (e) => {this.onResponse(buttons[i].value)});
		}
	}

	onResponse(data)
	{
		if(this.props.content.proc === 'practice')
		{
			this.onPracticeResponse(data);
		}
		else if(this.props.content.proc === 'test')
		{
			this.onTestResponse(data);
		}
	}

	onPracticeResponse(data)
	{
		let stimuli = this.getStimuli();
		var response = stimuli.onPracticeResponse(data);
		this.responded = response.responded;

		this.update();
		// For plot, we show feedback and then proceed
		if(response.next)
		{
			this.showBlank();
			this.blankTimeId = setTimeout(() => {this.clearFeedback()}, 1000);
			this.setState((prevState, props) => {return {feedbackAudio: -1}});
		}
		this.setState((prevState, props) => {
			return {feedback: response.feedback, feedbackAudio: response.feedback, stimuli: stimuli}
		});

	}

	onTestResponse(data)
	{
		let responses = this.state.responses;
		let stimuli = this.getStimuli();
		let qid = this.state.stimuli.qid() + 1;
		let starttime = this.state.starttime;
		let result = stimuli.onResponse(data, responses, qid, starttime);

		this.update();
		if(result.next)
		{
			this.responded = true;
			this.nextCanvasTrial();
		}
		else
		{
			this.setState((prevState, props) => {
				return {responses: result.responses, stimuli: stimuli}
			});
		}
		this.update();
	}

	render()
	{
		return this.renderStimulus();
	}

	renderStimulus()
	{
		let hint = null;
		if(this.props.content.hint)
		{
			hint = <CustomComponent content={this.props.content.hint}/>
		}

		let feedback = null;
		if(this.proc === 'practice' && (this.state.feedback > -1))
		{
			let audioPlayer = null;
			if(this.props.feedback[this.state.feedback].audio)
			{
				audioPlayer = <AudioPlayer key={Math.random()*1000} audio={this.props.feedback[this.state.feedback].audio}/>
			}
			feedback = <div className="canvas_feedback center text--center">{this.props.feedback[this.state.feedback].content}{audioPlayer}</div>
		}

		return (
			<Container className="canvas_container">
			<canvas ref={this.canvasRef} width="800" height="600" />
			{feedback}
			{this.props.content.responses.items}
			{hint}
			</Container>
		)
	}
}
