import React, {useEffect, useState} from 'react';
import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {Span} from '../components/Span.js';
import {Paragraph} from '../components/Paragraph.js';
import {Image} from '../components/Image.js';
import {Row} from '../layouts/Row.js';
import keyboard_pic from '../assets/keyboard.png';

/****
 Function to display countdown timer for simple task.
*/

export const SimpleCountdownInstructions = props => {
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
    <div className = "page center" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
      <p className="stimulus-text--large text--center">{remainingTime > 0 ? remainingTime : ""}</p>
    </div>
    </>
    : <div className="instructions"></div>
  )
};
