import React, {useEffect, useState} from 'react';
import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {Row} from '../layouts/Row.js';
import keyboard_pic from '../assets/keyboard.png';

/****
 Function to display countdown timer for CPT task.
*/

export const TapCountdownInstructions = props => {
  const {instructions, onContinue, handedness, trial, ...rest} = props;
  let [remainingTime, setRemainingTime] = useState(5);
  let [pressed, setPressed] = useState(false);
  let [view, setView] = useState("instructions");
  const parsed_handedness = JSON.parse(handedness);
  console.log('Thee handedness be ', parsed_handedness);

  function keyDown(e)
  {
    e.preventDefault();
    console.log('Key down is ', e.keyCode);
    if(e.keyCode === 32)
    {
      setPressed(true);
      document.removeEventListener('keydown', keyDown);
      document.removeEventListener('keyup', keyUp);
    }
  }

  function keyUp(e)
  {
    e.preventDefault();
    console.log('Key up is ', e.keyCode);
    //setPressed(false);
  }

  const countdown = time => {
    const next = time - 1;
    if(next > -1 )
    {
      setTimeout(() => {setRemainingTime(next);}, 1000);
    }
    else
    {
      onContinue();
    }
  }

  useEffect(() => {
    if(view === "instructions")
    {
      document.addEventListener('keydown', keyDown, false);
      document.addEventListener('keyup', keyUp, false);
    }
    if(pressed)
    {
      setView("countDown");
      countdown(remainingTime);
    }

    return () => {
      document.removeEventListener('keydown', keyDown);
      document.removeEventListener('keyup', keyUp);
    }
  }, [view, remainingTime, pressed]);

  return view === "instructions" ?
  (
    <div className = "page center">
     <div className="instructions text--center center">
      <div className="fullWidth">
      <p>{instructions[0].replace("<TRIAL_NUMBER>", trial)}</p>
      {instructions.map((item, index) => {
        if(item.includes(parsed_handedness))
        {
          return <p>{"** " + item.replace(parsed_handedness, "") + " **"}</p>
        }
      })}
      <p>{instructions[3]}</p>
      </div>
     </div>

     <div className="position-bottom--absolute">
      <table className="spacebar-response--table center--horizontal">
       <tbody>
        <tr className="flex fit-content center--horizontal">
         <td>
          <p className="center--horizontal text--center">PRESS THE SPACEBAR TO CONTINUE</p>
         </td>
         <td>
          <img src={keyboard_pic} className="keyboard--continue" alt="Keyboard image" />
         </td>
         <td>
          <div><p>&nbsp;</p></div>
         </td>
        </tr>
       </tbody>
      </table>
     </div>
    </div>
  )
  :
  <div className = "page center">
  {remainingTime > 0 && <p className="center stimulus-text--large text--center">{remainingTime}</p>}
  </div>
};
