import React, {useEffect, useState} from 'react';
import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {Row} from '../layouts/Row.js';
import keyboard_pic from '../assets/keyboard.png';

/****
 Function to display countdown timer for CPT task.
*/

export const TapTestCountdownInstructions = props => {
  const {instructions, onContinue, handedness, trial, spacebar_text, practice, ...rest} = props;
  let [remainingTime, setRemainingTime] = useState(7);
  const parsed_handedness = JSON.parse(handedness);
  console.log('Continue text be ', spacebar_text);

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

          countdown(remainingTime);

    return () => {
    }
  }, [remainingTime]);

  return remainingTime >= 4 ?
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
      <p className="text--center">{instructions[3] || 'The trial will begin in:'}</p>
      <br/>
      <p className="text--center">{remainingTime}</p>
      <br/>
      <p className="text--center">{instructions[4] || 'seconds'}</p>

      </div>
     </div>

     <div className="position-bottom--absolute-with-keyboard">
      <table className="keyboard-table">
       <tbody>
        <tr>
         <td colSpan={2}>
          <p className="text--center">{instructions[5] || 'USE THE CORRECT HAND POSITION WHEN PRESSING THE SPACEBAR'}</p>
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
