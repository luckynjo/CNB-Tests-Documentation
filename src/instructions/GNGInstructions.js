import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {Row} from '../layouts/Row.js';
import click_icon from '../assets/gng/click_2.svg';
import tap_icon from '../assets/gng/tap_2.svg';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export const GNGInstructions = props => {
  const {instructions, page, onGoBack, onContinue, continue_button_text, back_button_text, hideGoBack} = props;
  let page2_inst_str_buff1 = "";
  let page2_inst_str_buff2 = "";
  let page2_inst_str_buff3 = "";
  let page2_inst_str_buff4 = "";
  let page7_inst_str_buff1 = "";
  let page7_inst_str_buff2 = "";
  return (
    <>
    <div className = "instructions text--left top">
      {instructions.map((instruction, index) => {
        if(instruction !== continue_button_text && instruction !== back_button_text)
        {
          if(instruction.includes("GO!"))
          {
            const text_arr = instruction.split("GO!");
            return <p><span className="tap--instructions--text">{text_arr[0]}</span><span className="green">GO!</span><span className="tap--instructions--text">{text_arr[1]}</span></p>
          }
          else
          {
            if(page == 7){
              if(index == 0){
                return <div key={index*10 + 5}><p>{instruction}</p><br/></div>
              } else if(index == 1){
                page7_inst_str_buff1 = instruction;
              } else if(index == 2){
                page7_inst_str_buff1 = page7_inst_str_buff1 + " " + instruction + " ";
              } else if(index == 3){
                page7_inst_str_buff2 = " " + instruction + " ";
              } else if(index == 4){
                return (
                  <div key={index*10 + 5}>
                    <p>{page7_inst_str_buff1}<img src={tap_icon}/>{page7_inst_str_buff2}<img src={click_icon}/>{" "}{instruction}</p>
                    <br/>
                  </div>
                )
              } else {
                return <div key={index*10 + 5}><p>{instruction}</p><br/></div>
              }
            } else {
              if(index == 0){
                return <div key={index*10 + 5}><p>{instruction}</p><br/></div>
              } else if(index == 1){
                page2_inst_str_buff1 = instruction;
              } else if(index == 2){
                page2_inst_str_buff1 = page2_inst_str_buff1 + " " + instruction + " ";
              } else if(index == 3){
                page2_inst_str_buff2 = " " + instruction + " ";
              } else if(index == 4){
                page2_inst_str_buff3 = " " + instruction;
              } else if(index == 5){
                page2_inst_str_buff3 = page2_inst_str_buff3 + " " + instruction + " ";
              } else if(index == 6){
                page2_inst_str_buff4 = " " + instruction + " ";
              } else if(index == 7){
                return (<div key={index*10 + 5}>
                  <p>{page2_inst_str_buff1}<img src={tap_icon}/>{page2_inst_str_buff2}<img src={click_icon}/>{page2_inst_str_buff3}<img src={tap_icon}/>{page2_inst_str_buff4}<img src={click_icon}/>{" "}{instruction}</p>
                  <br/>
                </div>)
              }
            }
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
