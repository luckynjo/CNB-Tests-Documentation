import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';

import keyboard from '../assets/keyboard.png';
import {useEffect, useState} from 'react';

export const GNGFeedbackInstructions = props => {
  const {instructions, onPracticeGoBack, incorrect_practice_cnt, onTrialsComplete, spacebar_text, ...rest} = props;

  let [pressed, setPressed] = useState(false);

  function feedbackKeyDown(e)
  {
    e.preventDefault();
    if(e.keyCode === 32)
    {
      setPressed(true);
      if(incorrect_practice_cnt > 3){
        onTrialsComplete();
      } else {
        onPracticeGoBack();
      }
    }
  }

  // function keyUp(e)
  // {
  //   e.preventDefault();
  //   console.log('Key up is ', e.keyCode);
  //   //setPressed(false);
  // }

  useEffect(() => {

    document.addEventListener('keydown', feedbackKeyDown, false);
    //document.addEventListener('keyup', keyUp, false);
    if(pressed)
    {
      if(incorrect_practice_cnt > 3){
        onTrialsComplete();
      } else {
        onPracticeGoBack();
      }
    }

    return () => {
      document.removeEventListener('keydown', feedbackKeyDown);
      //document.removeEventListener('keyup', keyUp);
    }
  }, [pressed]);

  return (
    <>
    <div className="page center">
    <div className = "instructions text--left cpt-count-down">

      {instructions.map((instruction, index) => {
        return <div key={index*10 + 5}><p>{instruction}</p><br/></div>
      })}

      <br/>
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
