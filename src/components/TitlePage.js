import React from 'react';
import { useState, useEffect } from 'react';
//import Container from 'react-bootstrap/Container';
//import style from '../css/title_page_style.css';
//import AudioPlayer from '../AudioPlayer.js';
import {ContinueButton} from '../components/ContinueButton.js';
import upenn_shield_dark from '../assets/upenn_shield_dark.png';
import upenn_shield from '../assets/upenn_shield.png';
import logotype_dark from '../assets/logotype_white.png';
import logotype_light from '../assets/logotype_light.png';
const AudioPlayer = props => {

}

/*** Main page of current CNB tests. Contains test title, banner, continue button and other test information */
export default function TitlePage(props)
{
  document.title = props.content[0] || props.title;

  console.log('Conten be ', props.content);
  let audioPlayer = null;
  let buttonInvisibility  = '';

  if(props.audio)
  {
    audioPlayer = <AudioPlayer audio={props.audio} callback={enableButtons} isTitle={true}/>
    buttonInvisibility = buttonInvisibility + ' invisible';
  }

  // Specifically for PVT, remove copyright sign from test title.
  let title = (<p className={'test-header text--right right'}>{props.content[0] || props.title} &copy;</p>);
  if(props.copyrightTitle === 0)
  {
    title = (<p className={'test-header text--right right'}>{props.content[0] || props.title}</p>);
  }

  return (
    <div className={props.container_style || 'page'}>
      <div className="section--header">
        <div>
          <img src={props.theme == "light" ? upenn_shield : upenn_shield_dark}></img>
        </div>
        <div className="right">
          <img src={props.theme == "light" ? logotype_light : logotype_dark} className="right"></img>
          {title}
        </div>
      </div>

      <div className="section--body banner">
        {
          props.banner && (
            <img className="center" src={props.banner} width={props.banner_width || 312} height="auto"></img>
          )
        }
        {
          props.banner_text && (
            <div className={'center ' + props.banner_text_style}>
              {props.banner_text.map((item, index) => (<div key={index}>{item}</div>))}
            </div>
          )
        }

      </div>
      {audioPlayer}
      <div className="section--footer">
       <table><tbody><tr>
        <td><p className="small text--center test-form">{props.content[1] !== props.continue_button_text && props.content[1]}</p></td>
        <td><ContinueButton text={props.continue_button_text} classList={buttonInvisibility} onClick={() => props.onClick()}/></td>
        <td><p className="small text--center test-name">{props.test}</p></td></tr>
        <tr><td colSpan="3"><p className="copyright text--center">{props.citation || 'Copyright (c) 2005-2022 University of Pennsylvania  All Rights Reserved'}</p></td></tr>
        </tbody>
      </table>
      </div>
    </div>
  );
}

const enableButtons = () =>
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
