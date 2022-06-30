import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {Row} from '../layouts/Row.js';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export const NBackWelcomeInstructions = props => {
  const {instructions, onGoBack, onContinue, continue_button_text, back_button_text, hideGoBack} = props;
  const top_instructions = instructions.slice(0, 3);
  const nback_text = instructions.slice(3, 6);
  const instructions_rest = instructions.slice(6);
  return (
    <>
    <div className = "instructions text--left top">
      {top_instructions.map((instruction, index) => {
        if(instruction !== continue_button_text && instruction !== back_button_text)
        {
          return <div key={index*10 + 5}><p>{instruction}</p><br/></div>
        }
      })}

      {nback_text.map((instruction, index) => {
        if(instruction !== continue_button_text && instruction !== back_button_text)
        {
          return <div key={index*10 + 5}><p className="text--center">{instruction}</p><br/></div>
        }
      })}
      <br/>
      {instructions_rest.map((instruction, index) => {
        if(instruction !== continue_button_text && instruction !== back_button_text)
        {
          return <div key={index*10 + 5}><p>{instruction}</p><br/></div>
        }
      })}

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
    </>
  )
}
