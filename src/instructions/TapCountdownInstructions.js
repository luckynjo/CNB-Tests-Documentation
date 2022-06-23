import React, {useEffect, useState} from 'react';
import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {Row} from '../layouts/Row.js';
import keyboard_pic from '../assets/keyboard.png';

/****
 Function to display countdown timer for CPT task.
*/

export const TapCountdownInstructions = props => {
  const {instructions, onContinue, handedness, trial, spacebar_text, practice, ...rest} = props;
  let [remainingTime, setRemainingTime] = useState(practice ? 3 : 7);
  let [pressed, setPressed] = useState(false);
  let [view, setView] = useState("instructions");
  const parsed_handedness = JSON.parse(handedness);
  console.log('Continue text be ', spacebar_text);

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
    <>

     <div className="instructions text--center center">
      <div className="fullWidth">
      <p>{instructions[0].replace("<TRIAL_NUMBER>", trial)}</p>
      <br/>
      {instructions.map((item, index) => {
        if(item.includes(parsed_handedness))
        {
          return <p key={index + 101}>{"** " + item.replace(parsed_handedness, "") + " **"}</p>
        }
      })}
      <br/>
      <p>{instructions[3]}</p>
      </div>
     </div>

     <div className="position-bottom--absolute-with-keyboard">
      <table className="keyboard-table">
       <tbody>
        <tr>
         <td colSpan={2}>
          <p className="text--center">{spacebar_text || 'PRESS THE SPACEBAR TO CONTINUE'}</p>
         </td>
         <td>
          <img src={keyboard_pic} className="keyboard--continue left" alt="Keyboard image" />
         </td>
        </tr>
        <tr><td></td><td></td><td></td></tr>
       </tbody>
      </table>
     </div>
    </>
  )
  :
  <div className = "page center">
  {remainingTime > 0 && <p className="center stimulus-text--large text--center">{remainingTime}</p>}
  </div>
};
