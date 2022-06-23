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

    <div className="instructions text--left cpt-count-down">
    <p className="get-ready--text text--center">{instructions[0]}</p>
    <br/>
    <p className="instructions-text--medium text--center">{instructions[1]}</p>
    <br/>
    <p className="stimulus-text--large text--center">{remainingTime > 0 ? remainingTime : ""}</p>
    </div>
    </div>
    <div className="position-bottom--absolute-with-keyboard">
    <table className="keyboard-table">
    <tbody>
    <tr>
    <td colSpan={2}><p className="text--center">{instructions[2] || 'Use the spacebar to respond'}</p></td>
    <td><div><img src={keyboard_pic} className="keyboard--continue"/></div></td>
    </tr>
    <tr>
    <td><div></div></td>
    <td><div></div></td>
    <td><div></div></td>
    </tr>
    </tbody>
    </table>
    </div>

    </>
    : <div className="instructions"></div>
  )
};
