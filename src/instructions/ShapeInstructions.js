import React from "react";
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import circle from '../assets/cptChild/Blue_Circle.png';
import square from '../assets/cptChild/Blue_Square.png';
import triangle from '../assets/cptChild/Blue_Triangle.png';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export class ShapeInstructions extends React.Component {
  constructor(props){
    super(props);
    this.state={
      pressed: false
    };
    this.keyDown = this.keyDown.bind(this);
  }

  componentDidMount(){
    window.addEventListener("keydown", this.keyDown, false);
  }

  componentWillUnmount()
  {
    window.removeEventListener("keydown", this.keyDown, false);
  }

  keyDown(e){
    if(this.props.keyMode && e.keyCode === 32){
      this.setState((prevState, props) => {
        return {pressed: true};
      });
      setTimeout(()=>{
        this.setState((prevState, props) => {
          return {pressed: false};
        });
        this.props.onContinue();
      }, 1000);
    }
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
              if(index === 1 && type === "square"){
                return (
                  <div key={index*10 + 5}>
                    <div className="img-position-cpt-child"><img src={square} width="160" alt="square"/></div>
                    <br/>
                    <br/>
                    <div><p>{instruction}</p><br/></div>
                  </div>
                );
              }
              if(index === 1 && type === "triangle"){
                return (
                  <div key={index*10 + 5}>
                    <div className="img-position-cpt-child"><img src={triangle} width="160" alt="triangle"/></div>
                    <br/>
                    <br/>
                    <div><p>{instruction}</p><br/></div>
                  </div>
                );
              }
              if(index === 1 && type === "square-triangle"){
                return (
                  <div key={index*10 + 5}>
                    <div className="img-position-cpt-child-2"><img src={square} width="160" alt="square"/> <img src={triangle} width="160" alt="triangle"/></div>
                    <br/>
                    <br/>
                    <div><p>{instruction}</p><br/></div>
                  </div>
                );
              }
              if(index === 1 && type === "circle-2"){
                return (
                  <div key={index*10 + 5}>
                    <div className="img-position-cpt-child"><div className={this.props.form === "b" && this.state.pressed  ? "img-position-cpt-child-b" : ""}><img src={circle} width="160" alt="circle"/></div></div>
                    <br/>
                    <br/>
                    <div><p>{instruction}</p><br/></div>
                  </div>
                );
              }
              if(index === 2 && type === "circle"){
                return (
                  <div key={index*10 + 5}>
                    <div className="img-position-cpt-child"><div className={this.props.form === "b" && this.state.pressed  ? "img-position-cpt-child-b" : ""}><img src={circle} width="160" alt="circle"/></div></div>
                    <br/>
                    <br/>
                    <div><p>{instruction}</p><br/></div>
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
