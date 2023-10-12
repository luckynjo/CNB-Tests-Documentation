import React from 'react';
import keypic from '../assets/keyboard.png';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import AudioPlayer from '../utils/AudioPlayer.js';
import { useState, useEffect } from 'react';


export default function AudioInstructionsPage(props)
{
	let tracker = Math.random()*1000+1;
	let content = props.instructions.map((item, index) => {
		if(item === '')
		{
			return <br key={index + tracker}></br>
		}
		else
		{
			return <div key={index + tracker}>{item}</div>
		}
	});

	let audioPlayer = null;
	let buttonInvisibility  = '';

	if(props.content && props.content.audio)
	{
		audioPlayer = <AudioPlayer audio={props.content.audio} callback={enableButtons} />
	}
	else if(props.audio)
	{
		audioPlayer = <AudioPlayer audio={props.audio} callback={enableButtons} />
	}

	let goBackButton = <div><p></p></div>;

	const buttonResponses = (<ContinueButton className={buttonInvisibility} text={props.continue} onClick={() => props.onClick()}/>);
	const keyboardResponses = (
		<table className="spacebar-response--table center--horizontal">
		 <tbody>
			<tr className="flex fit-content center--horizontal">
				<td className="spacebar--message">
					<span className="center--horizontal">{props.continue || 'PRESS THE SPACEBAR TO CONTINUE'}</span>
				</td>
				<td>
				 <img src={keypic}  alt="Keyboard image" className="keyboard--continue"/>
				</td>
			</tr>
		 </tbody>
		</table>
	);

	let responseDevice = null;
	if(props.responseDevice === 'keyboard')
	{
		window.addEventListener('keydown', props.onClick);
		responseDevice = keyboardResponses;
	}
	else if(props.responseDevice === 'mouse')
	{
		responseDevice = buttonResponses;
	}

	if(props.goBackTo || props.canGoBack)
	{
		goBackButton = <GoBackButton classList={buttonInvisibility} onClick={(e) => props.onGoBack(props.goBackTo)}/>
	}
	let position = 'center';
	if(props.content && props.content.position)
	{
		position = props.content.position;
	}

	return (
		<div className={'page center'} >
		  <div className={"instructions text--left " + position}>{content}</div>
			{audioPlayer}
			<div className={"position-bottom--absolute generic--buttons " + buttonInvisibility}>
			{responseDevice}
		 </div>
		</div>
	);
}

function enableButtons()
{
  let buttons = document.getElementsByClassName('button');
  if(buttons)
  {
		for(let i=0; i < buttons.length; i++)
    {
			buttons[i].classList.remove('invisible');
		}
  }
}
