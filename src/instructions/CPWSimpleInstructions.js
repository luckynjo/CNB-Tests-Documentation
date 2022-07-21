import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {Row} from '../layouts/Row.js';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export const CPWSimpleInstructions = props => {
  const {instructions, onGoBack, onContinue, continue_button_text, back_button_text, hideGoBack} = props;

  return (
    <>
    <div className = "instructions text--left top">
      <p>{instructions[0]}</p>
      <br/>
      <p>
      <div>{instructions[1]}</div>
      <div>{instructions[2]}</div>
      <br/>
      <div>{instructions[3]}</div>
      <div>{instructions[4]}</div>
      </p>
      <br/>
      <br/>
      <div className="inline memory-buttons--other center--horizontal">
      <div className="memory-button">{instructions[5]}</div>
      <div className="memory-button">{instructions[6]}</div>
      <div className="memory-button">{instructions[7]}</div>
      <div className="memory-button">{instructions[8]}</div>
      </div>
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
    </>
  )
}
