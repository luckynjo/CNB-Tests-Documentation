import React, {useEffect, useState} from 'react';
import keyboard_pic from '../assets/keyboard.png';
import Xr from '../assets/flnb/Xr.png';
import Kr from '../assets/flnb/Kr.png';
import Vr from '../assets/flnb/Vr.png';
/****
 Function to display countdown timer for CPT task.
*/

export const NBackCountdownInstructions = props => {
  const {seconds, instructions, title, callback, ...rest} = props;
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
    <div className = "page">
    <div className="instructions text--left top">
    <p className="nback-header-instructions text--center">{instructions[0]}</p>
    <br/>
    <p className="text--center">{instructions[1]}</p>
    <br/>

    <div className="inline flex center--horizontal">
      {title.includes("0-Back") && <img src={Xr} className="stimulus--small center--horizontal"  alt="X"/>}
      {title.includes("1-Back") && <><img src={Vr} className="stimulus--small center--horizontal"  alt="M"/> <img src={Vr} className="stimulus--small center--horizontal"  alt="M"/></>}
      {title.includes("2-Back") && <><img src={Kr} className="stimulus--small center--horizontal"  alt="M"/> <img src={Vr} className="stimulus--small center--horizontal"  alt="M"/><img src={Kr} className="stimulus--small center--horizontal"  alt="M"/></>}
    </div>
    </div>

    </div>

    <div className="position-bottom--absolute-with-keyboard">
     <table className="keyboard-table">
      <tbody>
       <tr>
        <td>
        <div></div>
        </td>
        <td>
         <img src={keyboard_pic} className="keyboard--continue center--horizontal" alt="Keyboard image" />
        </td>
        <td>
        <div></div>
        </td>
       </tr>
       <tr><td></td><td></td><td></td></tr>
      </tbody>
     </table>
    </div>

    </>
    : <div className="instructions"></div>
  )
};
