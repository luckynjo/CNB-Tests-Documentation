import React from "react";
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {PlayButton} from '../components/PlayButton.js';
import circle from '../assets/cptChild/Circle_1.png';
import square from '../assets/cptChild/Square_1.png';
import triangle from '../assets/cptChild/Triangle_1.png';
import diamond from '../assets/cptChild/Diamond_1.png';
import star from '../assets/cptChild/Star_1.png';
import rectangle from '../assets/cptChild/Rectangle_1.png';
import click_sound from '../assets/cptChild/click_sound.mp3';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export class ShapeInstructions extends React.Component {
  constructor(props){
    super(props);
    this.state={
      pressed: false
    };
    this.audio = new Audio(click_sound);
  }

  render(){
    const hideGoBack = this.props.hideGoBack;
    const onGoBack = this.props.onGoBack;
    const onContinue = this.props.onContinue;
    const instructions = this.props.instructions;
    const continue_button_text = this.props.continue_button_text;
    const back_button_text = this.props.back_button_text;
    const type = this.props.type;
    return (
      <>
      <div className = "instructions text--left top">
        {instructions.map((instruction, index) => {
          if(instruction !== continue_button_text && instruction !== back_button_text)
          {
            if(instruction.includes("GO!"))
            {
              const text_arr = instruction.split("GO!");
              return <p><span>{text_arr[0]}</span><span className="green">GO!</span><span>{text_arr[1]}</span></p>
            }
            else
            {
              if(index === 1 && type === "diamond-rectangle"){
                return (
                  <div key={index*10 + 5}>
                    <div className="img-position-cpt-child-2"><img src={diamond} width="300" alt="diamond"/> <img src={rectangle} width="300" alt="rectangle"/></div>
                    <br/>
                    <br/>
                    <div><p>{instruction}</p><br/></div>
                  </div>
                );
              }
              if(index === 1 && type === "star-2"){
                return (
                  <div key={index*10 + 5} className="cptChild--stimuli--prac" onClick={() => {this.audio.play(); onContinue()}}>
                    <div className="img-position-cpt-child">
                      <div className={this.props.form === "b" && this.state.pressed  ? "img-position-cpt-child-b" : ""}>
                        <img src={star} width="300" alt="star"/>
                      </div>
                    </div>
                    <br/>
                    <br/>
                    <div><p>{instruction}</p><br/></div>

                  </div>
                );
              }
              if(index === 1 && type === "star"){
                return (
                  <div key={index*10 + 5}>
                    <div><p>{instruction}</p><br/></div>
                    <br/>
                    <div className="img-position-cpt-child"><img src={star} width="300" alt="star"/></div>
                    <br/>
                    <br/>
                  </div>
                );
              }
              if(index === 1 && type === "square"){
                return (
                  <div key={index*10 + 5}>
                    <div className="img-position-cpt-child"><img src={square} width="300" alt="square"/></div>
                    <br/>
                    <br/>
                    <div><p>{instruction}</p><br/></div>
                  </div>
                );
              }
              if(index === 1 && type === "triangle"){
                return (
                  <div key={index*10 + 5}>
                    <div className="img-position-cpt-child"><img src={triangle} width="300" alt="triangle"/></div>
                    <br/>
                    <br/>
                    <div><p>{instruction}</p><br/></div>
                  </div>
                );
              }
              if(index === 1 && type === "square-triangle"){
                return (
                  <div key={index*10 + 5}>
                    <div className="img-position-cpt-child-2"><img src={square} width="300" alt="square"/> <img src={triangle} width="300" alt="triangle"/></div>
                    <br/>
                    <br/>
                    <div><p>{instruction}</p><br/></div>
                  </div>
                );
              }
              if(index === 1 && type === "circle-2"){
                return (
                  <div key={index*10 + 5} >
                    <div className="cptChild--stimuli--prac" onClick={() => {this.audio.play(); onContinue()}}>
                      <div className="img-position-cpt-child">
                        <div className={this.props.form === "b" && this.state.pressed  ? "img-position-cpt-child-b" : ""}>
                          <img src={circle} width="300" alt="circle"/>
                        </div>
                      </div>
                    </div>
                    <br/>
                    <div><p>{instruction}</p><br/></div>

                  </div>
                );
              }
              if(index === 1 && type === "circle"){
                return (
                  <div key={index*10 + 5}>
                    <div><p>{instruction}</p><br/></div>
                    <div className="img-position-cpt-child"><div className={this.props.form === "b" && this.state.pressed  ? "img-position-cpt-child-b" : ""}><img src={circle} width="300" alt="circle"/></div></div>
                    <br/>
                    <br/>
                  </div>
                );
              }
              return <div key={index*10 + 5}><p>{instruction}</p><br/></div>
            }
          }
        })}
      </div>
      <div className="position-bottom--absolute">
      <table className="buttons-table">
      <tbody>
      <tr>
      <td><div>{!hideGoBack && <GoBackButton text={back_button_text} onClick={onGoBack}/>}</div></td>
      <td>{!this.props.keyMode ? <ContinueButton text={continue_button_text} onClick={onContinue}/> : ""}</td>
      <td><div></div></td>
      </tr>
      </tbody>
      </table>
      </div>
      </>
    );
  }
}
