import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {Row} from '../layouts/Row.js';
import inst1 from '../assets/cpt/inst1.png';
import inst2 from '../assets/cpt/inst2.png';
import inst3 from '../assets/cpt/inst3.png';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export const CPTNumberInstructions = props => {
  const {instructions, onGoBack, onContinue, continue_button_text} = props;
  //console.log('les instructions ', instructions);
  return (
    <>
    <div className = "instructions  text--left top">
      {instructions.map((instruction, index) => {
        if(index < 3)
        {
          return <p key={index*10 + 5}>{instruction}</p>
        }
      })}
      <div className='flex medium--box'>
       <img src={inst1} alt="inst1" className='center--horizontal img--demo'/>
      <img src={inst2} alt="inst2" className= 'center--horizontal img--demo' />
      <img src={inst3} alt="inst3" className= 'center--horizontal img--demo'/>
      </div>
      <br/>
      <div className= 'flex medium--box'>
      <p className= 'red text--center'>{instructions[3] ||"DON'T PRESS"}</p>
      <p className= 'red text--center'>{instructions[4] ||"DON'T PRESS"}</p>
      <p className= 'green text--center'>{instructions[5] ||"DO PRESS"}</p>
      </div>
      <br/>
      <p>{instructions[6] || "Let's practice."}</p>
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
