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
  const {instructions, test, response_device, onContinue, spacebar_text, continue_button_text, ...rest} = props;

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
          return <div key={index*10 + 5}><p className="instructions-text--small">{instruction}</p></div>
        }
      })}
      <br/>
      <div>
      <table className="center--horizontal">
      <tbody>
      <tr><td>
      <img className="center-prac-image img--prac" src={pracNum1} />
      </td></tr>
      <tr><td>
      <br/>
      <p className="text--center green">{instructions[3]}</p>
      </td></tr>
      </tbody>
      </table>
      </div>

    </div>

    <div className={response_device === "keyboard" ? "position-bottom--absolute-with-keyboard" : "position-bottom--absolute"}>

    <table className={response_device === "keyboard" ? "keyboard-table" : "buttons-table"}>
    <tbody>
    {response_device === "keyboard" &&
      <tr>
        <td colSpan={2}>
          <p className="center--horizontal text--center">{spacebar_text || 'PRESS THE SPACEBAR TO CONTINUE'}</p>
        </td>
        <td>
          <div>
            <img src={keyboard} alt="Keyboard image" className="keyboard--continue"/>
          </div>
        </td>
      </tr>
    }
    {response_device !== "keyboard" &&
    <tr>
      <td></td>
      <td><ContinueButton text={continue_button_text} onClick={onContinue}/></td>
      <td></td>
    </tr>
    }
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
