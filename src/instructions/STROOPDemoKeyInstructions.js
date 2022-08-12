import React from 'react';
import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {Row} from '../layouts/Row.js';
import stroop_vbn from "../assets/stroop/stroop-vbn.png";


export class STROOPDemoKeyInstructions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      index: 0,
      current_key: null,
      keys_pressed: [],
      passed: false
    }

    this.keyDown = this.keyDown.bind(this);
    this.next = this.next.bind(this);
   }


   componentDidMount()
   {
     window.addEventListener("keydown", this.keyDown, false);
    }


    componentWillUnmount()
    {
      window.removeEventListener("keydown", this.keyDown, false);
    }


    keyDown(e){
      let key_str = String.fromCharCode(e.keyCode);
      let arr = this.state.keys_pressed;
      if((key_str == "V" || key_str == "B" || key_str == "N") && !arr.includes(key_str)){
        if(this.state.keys_pressed.length == 2){
          this.setState((prevState) => {
            return {
              current_key: key_str,
              keys_pressed: [key_str, ...arr],
              passed: true
            }
          });
        } else {
          this.setState((prevState) => {
            return {
              current_key: key_str,
              keys_pressed: [key_str, ...arr]
            }
          });
        }
        this.next();
      }
    }


    next(){
      if(this.state.passed){
        setTimeout(this.props.onContinue, 1000);
      }
    }


    render(){
      const {instructions, onGoBack, onContinue, continue_button_text, back_button_text, hideGoBack} = this.props;
      return(
        <div className="page">
          <div className="hint">
            {instructions[0]}
          </div>
          <div className="demo--key--instr">
            <div className="demo--key--text">
              {this.state.current_key == "V" ? <div style={{color:"#FF0000"}}>{instructions[1]}</div> : (this.state.current_key == "B" ? <div style={{color:"#0000FF"}}>{instructions[2]}</div> : (this.state.current_key == "N" ? <div style={{color:"#00FF65"}}>{instructions[3]}</div> : "")) }
            </div>
          </div>
          <div>
            <div className="demo--key--img">
              <img src={stroop_vbn} alt="vbn"/>
            </div>
          </div>
        </div>
      )
    }
}
