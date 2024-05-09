import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';

import keyboard from '../assets/keyboard.png';
import {useEffect, useState} from 'react';

export const GNGFeedbackInstructionsWithBtn = props => {
  const {instructions, continue_button_text, onPracticeGoBack, incorrect_practice_cnt, onTrialsComplete, spacebar_text, ...rest} = props;

  let [pressed, setPressed] = useState(false);

  function onPress(e)
  {
    // e.preventDefault();
    // if(e.keyCode === 32)
    // {
    //
    // }

    setPressed(true);
    if(incorrect_practice_cnt > 3){
      onTrialsComplete();
    } else {
      onPracticeGoBack();
    }
  }

  // function keyUp(e)
  // {
  //   e.preventDefault();
  //   console.log('Key up is ', e.keyCode);
  //   //setPressed(false);
  // }

  useEffect(() => {

    //document.addEventListener('keydown', feedbackKeyDown, false);
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
      //document.removeEventListener('keydown', feedbackKeyDown);
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

    {/*<ContinueButton text={continue_button_text} onClick={onPress}/>
    <div style={{position: "absolute", display: "flex", left: "25%", bottom: "15px", transformX: "-50%", textAlign: "center", border: "2px solid white", color: "white", minWidth: "400px", height: "32px", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={onPress}>PRESS THE BUTTON TO CONTINUE</div>
    <div className="position-bottom--absolute-with-keyboard">
     <table className="keyboard-table">
      <tbody>
       <tr>
        <td colSpan={2}>
         <p className="text--center">{'PRESS THE BUTTON TO CONTINUE'}</p>
        </td>
        <td>
         <img src={keyboard} className="keyboard--continue left" alt="Keyboard image" />
        </td>
       </tr>
       <tr><td></td><td></td><td></td></tr>
      </tbody>
     </table>
    </div>
    */}
    <div className="position-bottom--absolute">
    <table className="buttons-table">
    <tbody>
    <tr>
    <td><div></div></td>
    <td><ContinueButton text={continue_button_text} onClick={onPress}/></td>
    <td><div></div></td>
    </tr>
    </tbody>
    </table>
    </div>
    </>
  )
}
