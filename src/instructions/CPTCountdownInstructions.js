import React, {useEffect, useState} from 'react';
import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {Span} from '../components/Span.js';
import {Paragraph} from '../components/Paragraph.js';
import {Image} from '../components/Image.js';
import {Row} from '../layouts/Row.js';
import keyboard_pic from '../assets/keyboard.png';

/****
 Function to display countdown timer for CPT task.
*/

export const CPTCountdownInstructions = props => {
  const {seconds, instructions, callback, ...rest} = props;
  let [remainingTime, setRemainingTime] = useState(seconds);

  useEffect(() => {

    const countdown = time => {
      const next = time - 1;
      if(next > -2 )
      {
        setTimeout(() => {setRemainingTime(next);}, 1000);
      }
      else
      {
        callback();
      }
    }
    countdown(remainingTime);
  }, [remainingTime]);

  return (
    remainingTime > 0 ?
    <>
    <div className = "page center">

    <div className="instructions text--left top">
    <p className="get-ready--text text--center">{instructions[0]}</p>
    <p className="instructions-text--medium text--center">{instructions[1]}</p>
    <p className="stimulus-text--large text--center">{remainingTime > 0 ? remainingTime : ""}</p>
    </div>
    </div>
    <div className="position-bottom--absolute">
    <table>
    <tbody>
    <tr>
    <td colSpan={2}><p className="text--center">Use the spacebar to respond</p></td>
    <td><div><Image img_url={keyboard_pic} classList="keyboard--continue left"/></div></td>
    </tr>
    </tbody>
    </table>
    </div>

    </>
    : <div className="instructions"></div>
  )
};
