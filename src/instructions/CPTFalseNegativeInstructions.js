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
export const CPTFalseNegativeInstructions = props => {
  const {instructions, onContinue, spacebar_text, ...rest} = props;

  let [pressed, setPressed] = useState(false);

  function keyDown(e)
  {
    e.preventDefault();
    console.log('Key down is ', e.keyCode);
    if(e.keyCode === 32)
    {
      setPressed(true);
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
    <div className = "instructions text--left top">

      {instructions.map((instruction, index) => {
        if(index < 3)
        {
          return <p key={index*10 + 5}>{instruction}</p>
        }
      })}

      <table>
      <tbody>
      <tr><td>
      <img className="center-prac-image img--prac" src={pracNum1} />
      </td></tr>
      <tr><td>
      <p className="text--center green">{instructions[3]}</p>
      </td></tr>
      </tbody>
      </table>

    </div>

    <div className="position-bottom--absolute">

    <table className="keyboard-response-table">
    <tbody>
    <tr>

    <td colSpan={2}><p className="center--horizontal text--center">{spacebar_text || 'PRESS THE SPACEBAR TO CONTINUE'}</p></td>
    <td><div><img src={keyboard} alt="Keyboard image" className="center--horizontal keyboard--continue"/></div></td>
    </tr>
    </tbody>
    </table>

    </div>



    </div>
    </>
  )
}
