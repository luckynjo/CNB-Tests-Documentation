import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import { GoBackButton } from '../components/GoBackButton.js';
import Xr from '../assets/flnb/Xr.png';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export const ZeroBackInstructions = props => {
  const {instructions, onGoBack, onContinue, continue_button_text, back_button_text, hideGoBack, test, ...rest} = props;

  return (
    <div className="page center">
    <div className = "instructions text--left top">
      {instructions.map((instruction, index) => {
        if(instruction !== continue_button_text && instruction !== back_button_text && index < instructions.length - 1)
        {
          return <div key={index*10 + 5}><p className="instructions-text--small">{instruction}</p><br/></div>
        }
      })}
      <br/>
      {test.includes("fnb") && <img src={Xr} className="stimulus--small center--horizontal" alt="Press"/>}
      {test.includes("lnb") && <p className="stimulus-text--medium text--center">X</p>}
      <br/>
      <br/>
      {!test.includes("lnb") && <p className="instructions-text--small">{instructions[instructions.length - 1]}</p>}

    </div>
    <div className="position-bottom--absolute">

    <table className="buttons-table">
    <tbody>
    <tr>
    <td><div>{!hideGoBack && <GoBackButton text={back_button_text} onClick={onGoBack}/>}</div></td>
    <td><ContinueButton text={continue_button_text} onClick={onContinue}/></td>
    <td><div></div></td>
    </tr>
    </tbody>
    </table>
    </div>
    </div>
  )
}
