import React, {useEffect, useState} from 'react';
import keyboard_pic from '../assets/keyboard.png';
import Xr from '../assets/flnb/Xr.png';
import Kr from '../assets/flnb/Kr.png';
import Vr from '../assets/flnb/Vr.png';
/****
 Function to display countdown timer for CPT task.
*/

export const NBackCountdownInstructions = props => {
  const {seconds, instructions, title, callback, response_device, test, ...rest} = props;
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
      {test.includes("fnb") && title.includes("0-Back") && <img src={Xr} className="stimulus--small center--horizontal"  alt="X"/>}
      {test.includes("fnb") && title.includes("1-Back") && <><img src={Vr} className="stimulus--small center--horizontal"  alt="M"/> <img src={Vr} className="stimulus--small center--horizontal"  alt="M"/></>}
      {test.includes("fnb") && title.includes("2-Back") && <><img src={Kr} className="stimulus--small center--horizontal"  alt="M"/> <img src={Vr} className="stimulus--small center--horizontal"  alt="M"/><img src={Kr} className="stimulus--small center--horizontal"  alt="M"/></>}
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
         {response_device === "keyboard" ?
           <img src={keyboard_pic} className="keyboard--continue center--horizontal" alt="Keyboard image" />
           :
           <div className="keyboard--continue center--horizontal">
           <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-mouse2-fill" viewBox="0 0 16 16">
  <path d="M7.5.026C4.958.286 3 2.515 3 5.188V5.5h4.5zm1 0V5.5H13v-.312C13 2.515 11.042.286 8.5.026M13 6.5H3v4.313C3 13.658 5.22 16 8 16s5-2.342 5-5.188z"/>
</svg>
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-hand-index-thumb-fill" viewBox="0 0 16 16">
  <path d="M8.5 1.75v2.716l.047-.002c.312-.012.742-.016 1.051.046.28.056.543.18.738.288.273.152.456.385.56.642l.132-.012c.312-.024.794-.038 1.158.108.37.148.689.487.88.716q.113.137.195.248h.582a2 2 0 0 1 1.99 2.199l-.272 2.715a3.5 3.5 0 0 1-.444 1.389l-1.395 2.441A1.5 1.5 0 0 1 12.42 16H6.118a1.5 1.5 0 0 1-1.342-.83l-1.215-2.43L1.07 8.589a1.517 1.517 0 0 1 2.373-1.852L5 8.293V1.75a1.75 1.75 0 0 1 3.5 0"/>
</svg>
           </div>
         }
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
