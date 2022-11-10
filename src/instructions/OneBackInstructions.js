import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import Vr from '../assets/flnb/Vr.png';
import green_arrow from '../assets/flnb/green_arrow.png';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export const OneBackInstructions = props => {
  const {instructions, onGoBack, onContinue, continue_button_text, back_button_text, hideGoBack} = props;

  return (
    <div className="page center">
    <div className = "instructions text--left center">

      <table>
      <tbody>
      <tr>
      <td colSpan={5}><p className="instructions-text--small">{instructions[0]}</p></td>
      </tr>

      <tr>
      <td  colSpan={5}><p className="instructions-text--small">{instructions[1]}</p></td>
      </tr>

      <tr>
      <td  colSpan={5}><p className="instructions-text--small">{instructions[2]}</p></td>
      </tr>

      <tr className="demo--1back">
      <td><span> </span></td>
      <td><span> </span></td>
      <td><span> </span></td>
      <td><p className='green text--center instructions-text--small'>{instructions[3]}</p></td>
      <td><span> </span></td>
      </tr>
      <tr  className="demo--1back">
      <td><span> </span></td>
        <td><span> </span></td>

        <td><span> </span></td>
        <td><img src={green_arrow} className="center--horizontal" alt="Arrow"/></td>
        <td><span> </span></td>
      </tr>
      <tr className="demo--1back">
      <td><span> </span></td>
        <td>  <img src={Vr} className="stimulus--small right" alt="Press"/> </td>
        <td><span> </span></td>
        <td>  <img src={Vr} className="stimulus--small left" alt="Press"/> </td>
        <td><span> </span></td>
      </tr>
      <tr>
      <td colSpan={5}><br/></td>
      </tr>
      </tbody>
      </table>

      <p className="instructions-text--small">{instructions[4] || ''}</p>
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
