import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {Row} from '../layouts/Row.js';
import left_img from '../assets/tap/left_hand.png';
import right_img from '../assets/tap/right_hand.png';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export const TAPHandPositionInstructions = props => {
  const {instructions, onGoBack, onContinue, continue_button_text, back_button_text, hideGoBack} = props;

  return (
    <>
    <div className = "instructions text--left center">
      {instructions.map((instruction, index) => {
        if(instruction !== continue_button_text && instruction !== back_button_text)
        {
          return <p key={index*10 + 5}>{instruction}</p>
        }
      })}

      <div className="inline hands--demo">
       <img className="hand_img" src={left_img} alt="Left handed position" />
       <img className="hand_img" src={right_img} alt="Right handed position" />
      </div>

    </div>
    <div className="position-bottom--absolute">
    <table className="buttons-table">
    <tbody>
    <tr>
    <td><div><GoBackButton text={back_button_text} onClick={onGoBack}/></div></td>
    <td><ContinueButton text={continue_button_text} onClick={onContinue}/></td>
    <td><div></div></td>
    </tr>
    </tbody>
    </table>
    </div>
    </>
  )
}
