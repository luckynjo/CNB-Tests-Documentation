import React from "react";
import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {Row} from '../layouts/Row.js';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export class GNGDemoInstructions extends React.Component {
  constructor(props){
    super(props);
    this.state={};
  }

  render(){
    const {instructions, onGoBack, onContinue, continue_button_text, back_button_text, hideGoBack} = this.props;
    return (
      <>
      <div className = "instructions text--left top" style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
        {instructions.map((instruction, index) => {
          if(instruction !== continue_button_text && instruction !== back_button_text)
          {
            if(index == 0){
              return <div key={index*10 + 5}><p style={{color: "green", marginBottom: "0px"}}>{instruction}</p></div>
            } else if(index == 1){
              return <div key={index*10 + 5}><p>{instruction}</p></div>
            } else if(index == 2){
              const pressText = instruction.split("  ")[0];
              const dontPressText = instruction.split("  ")[1];
              return (<div key={index*10 + 5} style={{width: "100%", display: "flex", flexDirection: "row", alignItems: "space-around"}}>
                  <p style={{color: "green", marginBottom: "0px", textAlign: "center" }}>{pressText}</p>
                  <p style={{color: "red", marginBottom: "0px", textAlign: "center" }}>{dontPressText}</p>
                </div>)
            } else if(index == 3){
              const x = instruction.split(" ")[0];
              const y = instruction.split(" ")[1];
              return (<div key={index*10 + 5} style={{width: "100%", display: "flex", flexDirection: "row", alignItems: "space-around"}}>
                  <p style={{textAlign: "center"}}>{x}</p>
                  <p style={{textAlign: "center"}}>{y}</p>
                </div>)
            } else if(index == 4){
              return <div key={index*10 + 5}><p style={{ textAlign: "center" }}>{instruction}</p></div>
            } else if(index == 5){
              const dontPress1 = instruction.split("  ")[0];
              const dontPress2 = instruction.split("  ")[1];
              return (<div key={index*10 + 5} style={{width: "100%", display: "flex", flexDirection: "row", alignItems: "space-around"}}>
                  <p style={{color: "red", marginBottom: "0px", textAlign: "center" }}>{dontPress1}</p>
                  <p style={{color: "red", marginBottom: "0px", textAlign: "center" }}>{dontPress2}</p>
                </div>)
            } else if(index == 6){
              const x1 = instruction.split(" ")[0];
              const x2 = instruction.split(" ")[1];
              return (<div key={index*10 + 5} style={{width: "100%", display: "flex", flexDirection: "row", alignItems: "space-around"}}>
                  <p style={{textAlign: "center"}}>{x1}</p>
                  <p style={{textAlign: "center"}}>{x2}</p>
                </div>)
            } else if(index == 7){
              return <div key={index*10 + 5}><p style={{color: "red", marginBottom: "0px"}}>{instruction}</p></div>
            }
            return <div key={index*10 + 5}><p>{instruction}</p></div>
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
    );
  }
}
