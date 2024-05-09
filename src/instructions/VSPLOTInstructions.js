import React from "react";
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
// import parallel_demo from "../assets/vsplot/parallel_demo.png";
// import not_parallel_demo from "../assets/vsplot/not_parallel_demo.png";
// import buttons_demo from "../assets/vsplot/buttons_demo.png";

export class VSPLOTInstructions extends React.Component {
  constructor(props){
    super(props);
    this.state={};
  }

  render(){
    const {instructions, onGoBack, images, page, onContinue, continue_button_text, back_button_text, hideGoBack} = this.props;

    const parallel_instruction = (page == 2) && instructions[instructions.length-3];
    const not_parallel_instruction = (page == 2) && instructions[instructions.length-2];
    return(
      <>
      <div className = "instructions text--left top">
        {instructions.map((instruction, index) => {
          if(instruction !== continue_button_text && instruction !== back_button_text)
          {
            if(page == 2 && (index < instructions.length-3)){
              return <div key={index*10 + 5}><p style={{fontSize: "24px"}}>{instruction}</p><br/></div>
            } else if (page == 3 && (index != instructions.length-1)){
              return <div key={index*10 + 5}><p style={{fontSize: "24px"}}>{instruction}</p><br/></div>
            }
          }
        })}
      </div>
      { page == 2 &&
         (
           <div style={{display: "flex", flexDirection: "column"}}>
             <div style={{ display: "flex", flexDirection: "row", position: "relative", top: "250px", alignItems: "center", justifyContent: "space-around"  }}>
             {images.map((image, index) => {
               return (
               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around" }}>
                 <div><p style={{fontSize: "24px"}}>{index == 0 ? parallel_instruction : not_parallel_instruction}</p></div>
                 <div><img src={image} /></div>
               </div>
             )
            })}
             </div>
             <div style={{ display: "flex", position: "relative", top: "260px", alignItems: "center", justifyContent: "center", maxWidth: "700px", minWidth: "700px", left: "50%", webkitTransform: "translateX(-50%)", transform: "translateX(-50%)"
}}><p style={{fontSize: "24px"}}>{instructions[instructions.length-1]}</p></div>
           </div>
          )
      }
      {
        page == 3 && (
          <div style={{ display: "flex", flexDirection: "column", position: "relative", top: "280px", alignItems: "center", justifyContent: "space-around" }}>
            <div>
              <img src={images[0]}/>
            </div>
            <div className="vsplot-inst text--left">
              <p style={{fontSize: "24px"}}>{instructions[instructions.length-1]}</p>
            </div>
          </div>
        )
      }
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
}
