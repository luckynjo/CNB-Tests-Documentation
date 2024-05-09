import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {Row} from '../layouts/Row.js';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export const CPFDemoInstructions = props => {
  const {instructions, onGoBack, onContinue, continue_button_text, back_button_text} = props;
  return (
    <>
    <div className = "instructions text--left top">

     <p className="cpf-demo-instructions-text">{instructions[0]}</p>
     <p>
     <p className="cpf-demo-instructions-text">{instructions[1]}</p>
     <p className="cpf-demo-instructions-text">{instructions[2]}</p>
     </p>
     <p>
     <p className="cpf-demo-instructions-text">{instructions[3]}</p>
     <p className="cpf-demo-instructions-text">{instructions[4]}</p>
     </p>

     <div className='cpf-instructions-button center--horizontal inline'>
     {instructions.map((item, index) => {
       if(index > 4)
       {
         return (<button className="button cpf-test-button" key={index + 55}>{item}</button>)
       }
     })}
     </div>

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
