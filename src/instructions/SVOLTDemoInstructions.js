import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {Row} from '../layouts/Row.js';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export const SVOLTDemoInstructions = props => {
  const {instructions, onGoBack, onContinue, continue_button_text, back_button_text} = props;
  console.log('les instructions ', instructions);
  return (
    <>
    <div className = "instructions text--left top">

     <p>{instructions[0]}</p>
     {instructions.map((item, index) => {
       if(index >0 && index < 2)
       {
         return (<p key={index + 50}>{item}</p>)
       }
     })}
     <br/>

     <div className='memory-buttons--other center--horizontal inline'>
     {instructions.map((item, index) => {
       if(index > 1 && index < 6)
       {
         return (<button className="memory-button" /*"button cpf-button"*/ key={index + 55}>{item}</button>)
       }
     })}
     </div>
     <br/>

     {instructions.map((item, index) => {
       if(index >5)
       {
         return (<p key={index + 50}>{item}</p>)
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
