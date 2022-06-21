import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';

import pracNum1 from '../assets/cpt/pracNum1.png';
import pracNum2 from '../assets/cpt/pracNum2.png';
import pracNum3 from '../assets/cpt/pracNum3.png';
import pracNum4 from '../assets/cpt/pracNum4.png';
import pracNum5 from '../assets/cpt/pracNum5.png';
import keyboard from '../assets/keyboard.png';
import Xr from '../assets/flnb/Xr.png';
import Vr from '../assets/flnb/Vr.png';
import Kr from '../assets/flnb/Kr.png';
import {useEffect, useState} from 'react';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.



<table>
<tbody>
<tr>

{practice_type.includes("0") && <td><img className="stimulus--small center--horizontal" src={Xr} /></td>}

</tr>
<tr><td>
<p className="text--center green">{instructions[3]}</p>
</td>
</tr>
</tbody>
</table>
*/
export const NBackPracticeFailedInstructions = props => {
  const {instructions, onContinue, spacebar_text, practice_type, ...rest} = props;

  let [pressed, setPressed] = useState(false);

  function keyDown(e)
  {
    e.preventDefault();
    console.log('Key down is ', e.keyCode);
    if(e.keyCode === 32)
    {
      setPressed(true);
      onContinue();
    }
  }

  function keyUp(e)
  {
    e.preventDefault();
    console.log('Key up is ', e.keyCode);
    //setPressed(false);
  }

  useEffect(() => {

    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
    if(pressed)
    {
      onContinue();
    }

    return () => {
      document.removeEventListener('keydown', keyDown);
      document.removeEventListener('keyup', keyUp);
    }
  }, [pressed]);

  return (
    <>
    <div className="page center">
    <div className = "instructions text--left cpt-count-down">

      {instructions.map((instruction, index) => {
        return <div key={index*10 + 5}><p>{instruction}</p><br/></div>
      })}

      <div className="inline flex center--horizontal">
        {practice_type.includes("0") && <img src={Xr} className="stimulus--small center--horizontal"  alt="X"/>}
        {practice_type.includes("1") && <><img src={Vr} className="stimulus--small center--horizontal"  alt="M"/> <img src={Vr} className="stimulus--small center--horizontal"  alt="M"/></>}
        {practice_type.includes("2") && <><img src={Kr} className="stimulus--small center--horizontal"  alt="M"/> <img src={Vr} className="stimulus--small center--horizontal"  alt="M"/><img src={Kr} className="stimulus--small center--horizontal"  alt="M"/></>}
      </div>

      <br/>
      <p className="text--center green">{instructions[3]}</p>


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
         <img src={keyboard} className="keyboard--continue left" alt="Keyboard image" />
        </td>
       </tr>
       <tr><td></td><td></td><td></td></tr>
      </tbody>
     </table>
    </div>
    </>
  )
}
