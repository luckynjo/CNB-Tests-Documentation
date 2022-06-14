import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {Row} from '../layouts/Row.js';
import num1 from '../assets/cpt/num1.png';
import num2 from '../assets/cpt/num2.png';
import num3 from '../assets/cpt/num3.png';
import num4 from '../assets/cpt/num4.png';
import num5 from '../assets/cpt/num5.png';
import num6 from '../assets/cpt/num6.png';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export const CPTNumberTestInstructions = props => {
  const {instructions, onGoBack, onContinue, continue_button_text} = props;
  return (
    <div className = "instructions">
      {instructions.map((instruction, index) => {
        // Ignore the continue and goback text.
        if(index < instructions.length - 2)
        {
          return <p key={index*10 + 5}>{instruction}</p>
        }
      })}

      <br/>
      <div className="flex center--horizontal">
      <img src={num4} alt="8" className= 'center--horizontal img-test-demo'/>
      <img src={num1} alt="2" className= 'center--horizontal img-test-demo' />
      <img src={num2} alt="4" className= 'center--horizontal img-test-demo'/>
      <img src={num3} alt="5" className= 'center--horizontal img-test-demo'/>
      <img src={num5} alt="1" className= 'center--horizontal img-test-demo'/>
      <img src={num6} alt="7" className= 'center--horizontal img-test-demo'/>
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
