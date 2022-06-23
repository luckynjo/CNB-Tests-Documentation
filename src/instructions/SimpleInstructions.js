import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {Row} from '../layouts/Row.js';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export const SimpleInstructions = props => {
  const {instructions, onGoBack, onContinue, continue_button_text, back_button_text, hideGoBack} = props;

  return (
    <>
    <div className = "instructions text--left top">
      {instructions.map((instruction, index) => {
        if(instruction !== continue_button_text && instruction !== back_button_text)
        {
          if(instruction.includes("GO!"))
          {
            const text_arr = instruction.split("GO!");
            return <p><span>{text_arr[0]}</span><span className="green">GO!</span><span>{text_arr[1]}</span></p>
          }
          else
          {
            return <div key={index*10 + 5}><p>{instruction}</p><br/></div>
          }
        }
      })}
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
