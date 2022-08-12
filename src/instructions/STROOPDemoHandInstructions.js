import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {Row} from '../layouts/Row.js';

export const STROOPDemoHandInstructions = props => {
  const {instructions, onGoBack, onContinue, continue_button_text, back_button_text, hideGoBack} = props;
  return (
    <>
    <div className="flex container">
      <div className="instructions--left container">
        {instructions.map((instruction, index) => {
          if(index < instructions.length-2)
          {
            return <div key={index*10 + 5}><p className="text--left top--hand--instruction">{instruction}</p><br/></div>
          }
        })}
      </div>
      <div className="inline position--bottom--abosolute">
        <div className="button stroop-hand-button left" onClick={onContinue}>{instructions[instructions.length-2]}</div>
        <div className="button stroop-hand-button right" onClick={onContinue}>{instructions[instructions.length-1]}</div>
      </div>
    </div>
    </>
  )
}
