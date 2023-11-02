import React from 'react';
import ResponseButton from './ResponseButton.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CNBResponse from '../trials/CNBResponse.js';
import Stimuli from '../stimuli/Stimuli.js';
import CustomComponent from './CustomComponent.js';
import AudioPlayer from '../utils/AudioPlayer.js';

const IMG_REGEX = /\.?(png|gif|jpe?g)/ig;

/***
* Basic experiment trial block.
*
*/
export default class BaseTrials extends React.Component
{
	constructor(props)
	{
		super(props);
		var stimuli = new Stimuli(this.props.trials, this.props.content.randomize || false, this.props.content.sampleSize || 1, this.props.content.n || 0, this.props.content.terminate || {});
		var index = stimuli.getIndex();
		this.state = {
			index:index,
			startIndex: index,
			trial: this.props.forwardFeedback || this.props.trials[index],
			responses: [],
			starttime: new Date(),
			stimuli: stimuli,
			demo:false,
			drawCount: 0,
			feedback: ''
		}

		this.proc = this.props.content.proc;
		this.responded = false;
		this.timerId = -1;
		this.blankTimeId = -1;
		this.feedback = false;
		this.demo = false;
		this.lastResponse = '';
		this.responseDevice = this.props.content.response_type;
		this.event_log = [];
	}

	componentDidMount()
	{
		this.starttime = new Date();
	}

	componentWillUnmount()
	{
		this.clearTimeout();
	}

	findAssetFile(url)
	{
		let file = url;
		let fromLocalStorage = localStorage.getItem(url);
		if(!fromLocalStorage)
		{
			this.findAssetFileInArray(url);
		}
		return fromLocalStorage || file;
	}

	findAssetFileInArray(url)
	{
		let file = url;
		let assets = this.props.assets || [];
		for(let i=0; i < assets.length; i++)
		{
			if((assets[i].url).includes(url))
			{
				file = assets[i].file;
			}
		}
		return file;
	}

	render()
	{
		let audioPlayer = null;
		if(this.props.audio)
		{
			audioPlayer = <AudioPlayer
			audio={this.props.audio}
			 />;
		}

		return(
			<Container className={this.props.trial_style}>
			{this.renderStimulus()}
			{audioPlayer}
			{this.renderChoices()}
			</Container>
		);
	}

	showFeedback(feedback)
	{
		return(
			<Container className="center">
			<CustomComponent content={feedback} />
			</Container>
		);
	}

	clearTimeout()
	{
		window.clearInterval(this.timerId);
		window.clearTimeout(this.blankTimeId);
	}

	getIndex()
	{
		return this.state.stimuli.getIndex();
	}

	getResponses()
	{
		return this.state.responses;
	}

	getStimuli()
	{
		return this.state.stimuli;
	}

	onMouseMove(response)
	{

	}

  /***
	* Handle responses.
	* @param response to a question / trial
	* @param slideTask whether this is a slide task ie does not move to the next question based on response.
	* @param callback only used if the block loads the next stimulus; will be called after the new stimulus
	*                 is set in state.
	*/
	onResponse(response, slideTask, callback)
	{
		let duration = new Date() - this.state.starttime;
		let stimuli = this.getStimuli();
		let responses = this.getResponses();
		this.responded = true;
		this.lastResponse = response;
		// End test block early for tasks which terminate based on responses.
		if(stimuli.discontinueTest(response))
		{
			responses.push(new CNBResponse(stimuli.qid() + 1, response, duration));
			// Slide test tasks temrinate after trial duration.
			if(!slideTask)
			{
				this.props.onComplete(responses);
			}
		}
		else if(stimuli.hasNext())
		{
			// Add response and continue if not slide task.
			responses.push(new CNBResponse(stimuli.qid() + 1, response, duration));
			if(!slideTask)
			{
				this.nextTrial(callback);
			}
		}
		else
		{
			// Return to experiment to submit responses.
			if(!slideTask)
			{
				this.props.onComplete(this.state.responses);
			}
		}
	}

	/***
	* Additional rendering goes here in subclasses.
	*/
	update()
	{

	}

  /***
	* Load next trial
	*
	*/
	nextTrial(callback)
	{
		let stimuli = this.getStimuli();
		let next = stimuli.next();
		this.responded = false;

		// Has not reached end of block, load next trial.
		if(stimuli.hasNext())
		{
			this.log_event('start_onset_stim', (new Date()).getTime());
			this.starttime = new Date();
			this.setState((prevState, props) => {
				return {
				index: next,
				trial: this.props.trials[next],
				stimuli: stimuli,
				feedback: -1,
				drawCount: 0,
				starttime: new Date()
			}}, callback);
			// For slide tasks, display blank screen.
			/***if(this.state.trial.blank > 0 && this.state.trial.duration > 0)
			{
				this.blankTimeId = setTimeout(() =>{this.showBlank()}, this.state.trial.duration - this.state.trial.blank);
			}*/

		}
		// Block finished.
		else
		{
			this.clearTimeout();
			this.onBeforeComplete();

			if(this.props.content.finish === 'partial')
			{
				if(this.props.content.showFeedback && this.state.feedback != '')
				{
					const ff = {stimulus: '', duration: 1};
					this.props.onPartialResponse({responses: this.state.responses, forwardFeedback: ff});
				}
				else if(this.props.content.canOverrideResponses)
				{
					this.props.onOverrideResponses(this.state.responses);
				}
				else
				{
					let l = this.event_log;
					this.props.onPartialResponse({responses: this.state.responses, logs: l});
				}
			}
			else if(this.props.content.finish === 'submit')
			{
				let l = this.event_log;
				this.props.onComplete({responses: this.state.responses, logs: l});
			}
			// Specifically for pcet, end the test block early if they have reached this point
			// ie they did not get the required 10 correct.
			else if(this.props.content.finish === 'both')
			{
				let l = this.event_log;
				this.props.onComplete({responses: this.state.responses, logs: l});
			}
			else if(this.props.content.proc === 'test')
			{
				let l = this.event_log;
				this.props.onComplete(this.state.responses);
			}
			else if(this.props.content.proc === 'practice')
			{
				this.props.onContinue();
			}
			// Finished with unknown block, so go to next
			else
			{
				this.props.onClick();
			}
		}
	}

	// Only used for debugging - log the events as they occur in the task, data only saved on hydra.
	// Uncomment code when running on hydra.
	// A better approach would be to add a debug flag.
	log_event(evt_description, timestamp, trial)
	{
		//let index = this.event_log.length;
		//let content = '{"subid": "' + (this.props.cookie || 'unknown_subid') + '", "test": "' + this.props.test + '", "pos": '+ index + ', "trial": ' + (trial || this.state.stimuli.qid() + 1) + ', "description": "' + evt_description + '", "time": ' + timestamp + '}';
		//this.event_log.push(content);
	}

	/***
	 * Subclasses can override this to do any cleanup or additional tasks with their
	 * response sets before the parent timeline moves on.
	 */
	onBeforeComplete() {}

	onImageLoaded(e, index)
	{
		//console.log('Loaded image for  ', index);
		this.log_event('loaded_image_for_trial_' + index, (new Date()).getTime());
	}

	renderStimulus()
	{
		let stim = this.state.trial.stimulus || this.state.trial;

		if(typeof stim === 'object')
		{
				return <CustomComponent content={stim} />
		}
		else if(stim === "blank")
		{
			return (<span></span>);
		}
		else if(stim.match(IMG_REGEX))
		{
			let file = this.findAssetFile(stim);
			return (
				<div className={this.props.stimulus_style}>
				<img className="center--relative" src={file} alt="Stimulus" onLoad={(e) => this.onImageLoaded(e, this.state.stimuli.qid() + 1)}/>
				</div>
			);
		}
		else
		{
			return (
				<div className={this.props.stimulus_style}>
				<h1 className={this.props.classList || this.props.content.stimulus_style}>{stim}</h1>
				</div>
			);
		}
	}

	renderChoices()
	{
		if(this.props.content.response_type === 'keyboard')
		{
			return;
		}
		else
		{
			let response_style = this.state.trial.response_style || this.props.response_style;
			let choice_style = this.props.responses.choice_class;
			let choices = this.state.trial.responses || this.props.responses.items;

			const items = choices.map((item, index) => <ResponseButton key={index + 1} secondaryContent={item.secondaryContent} img={item.img} className={item.classList || choice_style} response={item.response || index + 1} onClick={(e) => this.onResponse(e)} onMouseMove={(e) => this.onMouseMove(e)} text={item.text} />);

			return (
				<div className={response_style}>{items}</div>
			);
		}
	}
}
