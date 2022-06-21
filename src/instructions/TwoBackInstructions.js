import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import Vr from '../assets/flnb/Vr.png';
import Kr from '../assets/flnb/Kr.png';
import green_arrow from '../assets/flnb/green_arrow.png';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export const TwoBackInstructions = props => {
  const {instructions, onGoBack, onContinue, continue_button_text, back_button_text, hideGoBack} = props;

  return (
    <div className="page center">
    <div className = "instructions text--left top">

      <table>
      <tbody>
      <tr>
      <td colSpan={3}><p className="instructions-text--medium">{instructions[0]}</p><br/></td>
      </tr>

      <tr>
      <td  colSpan={3}><p className='instructions-text--medium'>{instructions[1]}</p></td>
      </tr>
      <tr>
       <td  colSpan={3}><p className='instructions-text--medium'>{instructions[2]}</p></td>
      </tr>
      <tr className="demo--2back">
      <td><span> </span></td>
      <td><span> </span></td>
      <td><p className='green text--center'>{instructions[3] || 'Press'}</p></td>
      </tr>
      <tr  className="demo--2back">
      <td><span> </span></td>
        <td><span> </span></td>
        <td><img src={green_arrow} className="center--horizontal" alt="Arrow"/></td>
      </tr>
      <tr className="demo--2back">
        <td>  <img src={Kr} className="stimulus--small center--horizontal" alt="Press"/> </td>
        <td>  <img src={Vr} className="stimulus--small center--horizontal" alt="Press"/> </td>
        <td>  <img src={Kr} className="stimulus--small center--horizontal" alt="Press"/> </td>
      </tr>

      <tr>
      <td colSpan={3}><br/></td>
      </tr>
      </tbody>
      </table>

    </div>
    <div className="position-bottom--absolute">

    <table className="buttons-table">
    <tbody>
    <tr>
    <td><div></div></td>
    <td><ContinueButton text={continue_button_text} onClick={onContinue}/></td>
    <td><div></div></td>
    </tr>
    </tbody>
    </table>
    </div>
    </div>
  )
}
