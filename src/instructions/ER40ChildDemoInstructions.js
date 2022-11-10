import React from 'react';
import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {Row} from '../layouts/Row.js';
import angry_emoji from '../assets/er40Child/anger_transparent.png';
import happy_emoji from '../assets/er40Child/happy_transparent.png';
import fear_emoji from '../assets/er40Child/fear_transparent.png';
import noe_emoji from '../assets/er40Child/Neutral_transparent.png';
import sad_emoji from '../assets/er40Child/sad_transparent.png';
import ER40ChildSlideshow from '../trials/ER40ChildSlideshow.js';
import ER40ChildDemoInstructionsPage1 from './ER40ChildDemoInstructionsPage1.js';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export default class ER40ChildDemoInstructions extends React.Component {
  constructor(props){
    super(props);
    this.state={
      canContinue: false,
      start: false
    };

    this.updateCanCantinue = this.updateCanCantinue.bind(this);
    this.startAnimation = this.startAnimation.bind(this);
  }

  updateCanCantinue(boolVal){
    this.setState({
      canContinue: boolVal
    });
  }

  startAnimation(){
    this.setState({
      start: true
    });
  }

  render(){
    const {instructions, onGoBack, onContinue, continue_button_text, back_button_text, play_button_text} = this.props;
    return (
      <>
      <div className = "instructions text--left top">

       <div style={{display: "flex", alignItems: "center", justifyContent:"space-around"}}>
      {!this.state.start ? <ER40ChildDemoInstructionsPage1 instructions={instructions}/> : <ER40ChildSlideshow instructions={instructions} text={instructions[1]} canContinue={this.updateCanCantinue}/>}
      </div>
       <br/>
       <br/>

       </div>

       <div className="position-bottom--absolute">
       <table className="buttons-table">
       <tbody>
       <tr>
       <td><div><GoBackButton text={back_button_text} onClick={onGoBack}/></div></td>
       <td>{this.state.canContinue ? <ContinueButton text={continue_button_text} onClick={onContinue}/> : ""}</td>
       <td><div></div></td>
       </tr>
       </tbody>
       </table>
       {!this.state.start ? <div className="button play-btn" onClick={() => this.startAnimation()}>{play_button_text}</div> : ""}
      </div>
      </>
    )
  }
}
