import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {Image} from '../components/Image.js';
import keyboard_pic from '../assets/keyboard.png';
import {Row} from '../layouts/Row.js';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export const SimpleKeyboardInstructions = props => {
  const {instructions, onGoBack, onContinue} = props;
  return (
    <>
    <div className = "instructions">
      <SimpleInstructionsParser components={instructions} />
    </div>
    <Row classList="position-bottom--absolute">
    <Image img_url={keyboard_pic}/>
    <ContinueButton onClick={onContinue}/>
    </Row>
    </>
  )
}
