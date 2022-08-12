import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {Row} from '../layouts/Row.js';
import pracNum1 from '../assets/cpt/pracNum1.png';
import pracNum2 from '../assets/cpt/pracNum2.png';
import pracNum3 from '../assets/cpt/pracNum3.png';
import pracNum4 from '../assets/cpt/pracNum4.png';
import pracNum5 from '../assets/cpt/pracNum5.png';
import keyboard from '../assets/keyboard.png';
import {useEffect, useState} from 'react';

/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export const CPTFalsePositiveInstructions = props => {
  const {instructions, onContinue, spacebar_text, ...rest} = props;
  console.log('les instructions ', instructions);

  let [pressed, setPressed] = useState(false);

  function keyDown(e)
  {
    console.log('Key down is ', e.keyCode);
    if(e.keyCode === 32)
    {
      setPressed(true);
    }
  }

  function keyUp(e)
  {
    console.log('Key up is ', e.keyCode);
    setPressed(false);
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
    <div className = "instructions top text--left">

      {instructions.map((instruction, index) => {
        if(index < 3)
        {
          return <div key={index*10 + 5}><p>{instruction}</p><br/></div>
        }
      })}

      <div className="center--horizontal">
      <div className="inline incorrect-response--multiple">
      <div><img className="center-prac-image img--prac" src={pracNum2} /></div>
      <div><img className="center-prac-image img--prac" src={pracNum3} /></div>
      <div><img className="center-prac-image img--prac" src={pracNum4} /></div>
      <div><img className="center-prac-image img--prac" src={pracNum5} /></div>
      <div><img className="center-prac-image img--prac" src={pracNum1} /></div>
      </div>

      <div className="inline incorrect-response--multiple">
      <div><p className="red text--center">{instructions[3] || "DON'T PRESS"}</p></div>
      <div><p className="red text--center">{instructions[4] || "DON'T PRESS"}</p></div>
      <div><p className="red text--center">{instructions[5] || "DON'T PRESS"}</p></div>
      <div><p className="red text--center">{instructions[6] || "DON'T PRESS"}</p></div>
      <div><p className="green text--center">{instructions[7] || "DO PRESS"}</p></div>
      </div>
      </div>


    </div>

    <div className="position-bottom--absolute-with-keyboard">

    <table className="keyboard-table">
    <tbody>
    <tr className="flex fit-content center--horizontal">

    <td colSpan={2}><p className="center--horizontal text--center">{spacebar_text || 'PRESS THE SPACEBAR TO CONTINUE'}</p></td>
    <td><div><img src={keyboard} alt="Keyboard image" className="center--horizontal keyboard--continue"/></div></td>
    </tr>
    <tr>
    <td><div></div></td>
    <td><div></div></td>
    <td><div></div></td>
    </tr>
    </tbody>
    </table>

    </div>
    </div>
    </>
  )
}
