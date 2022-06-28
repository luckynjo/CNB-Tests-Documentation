import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {Row} from '../layouts/Row.js';
import digsym_a_banner from '../assets/digsym/digsym_a_banner.png';
import digsym_b_banner from '../assets/digsym/digsym_b_banner.png';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export const DigsymInstructions = props => {
  const {instructions, onGoBack, onContinue, continue_button_text, back_button_text, same_text, different_text, test_form} = props;

  const updated_instructions = instructions.filter(item => item !== same_text && item !== different_text && item !== continue_button_text && item !== back_button_text);
  const size = updated_instructions.length;
  const instructions_str = updated_instructions.map((item, index) => {
    if(item && index < size - 2)
    {


    }
  });
  const other_instructions_str = updated_instructions.map((item, index) => {
      if(item && index >= size - 2)
      {
        if(item !== same_text && item !== different_text)
        {
          return item;
        }
      }
    });
  return (
    size > 4 ?
    <div className="page full">
    <div className = "instructions digsym text--left">

    <img className="instructions-image-centered" src={test_form === "a" ? digsym_a_banner : digsym_b_banner} />
     <p>{instructions_str.join(" ")}</p>
     <br/>

     <p>{other_instructions_str.join(" ")}</p>
     <br/>

     <div className="inline instructions-button-row">

       <div className="inline instructions-button-wrapper"><p className="instructions-button">{same_text}</p></div>
       <div className="inline instructions-button-wrapper"><p className="instructions-button">{different_text}</p></div>
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
    </div>
     :
     <div className="page full">
       <div className = "instructions digsym text--left">
       {instructions.map((instruction, index) => {
         if(instruction !== same_text && instruction !== different_text)
         {
           return <div key={index + instruction.length}><p>{instruction}</p><br/></div>
         }

       })}
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
     </div>
  )
}
