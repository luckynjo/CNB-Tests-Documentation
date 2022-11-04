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
import angry_practice from '../assets/er40Child/angry_practice.png';

/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export default class SlideInstructions extends React.Component {
  constructor(props){
    super(props);
    this.state={
      index: 0,
      maxIndex: 4,
      canContinue: false
    };

    this.emojiArray = [happy_emoji, sad_emoji, angry_emoji, fear_emoji, noe_emoji];

    this.nextPage = this.nextPage.bind(this);
    this.getInstruction = this.getInstruction.bind(this);
  }

  nextPage(){
    const nextIndex = this.state.index + 1;
    if(nextIndex < this.state.maxIndex){
      this.setState({
        index: nextIndex
      });
    }
    else if (nextIndex === this.state.maxIndex){
      this.setState({
        index: nextIndex,
        canContinue: true
      });
    }
    else {
      this.setState({
        canContinue: true
      });
    }
  }

  getInstruction(instructions){
    return instructions[this.state.index];
  }

  render(){
    const {instructions, onGoBack, onContinue, continue_button_text, back_button_text, hideGoBack, next_button_text} = this.props;

    return (
      <>
      <div className = "instructions top" style={{textAlign: "center"}}>
          <div><p>{this.getInstruction(instructions)}</p><br/></div>
      </div>
      <div style={{position:"relative", top: "160px", textAlign:"center"}}>
        <img src={this.emojiArray[this.state.index]} width="300px" height="300px"/>
      </div>
      <div className="position-bottom--absolute">
      <table className="buttons-table">
      <tbody>
      <tr>
      <td><div>{!hideGoBack && <GoBackButton text={back_button_text} onClick={onGoBack}/>}</div></td>
      <td>{this.state.canContinue ? <ContinueButton text={continue_button_text} onClick={onContinue}/> : ""}</td>
      <td><div></div></td>
      </tr>
      </tbody>
      </table>
      </div>
      {!this.state.canContinue ? <div className="button next--btn" onClick={this.nextPage}>{next_button_text}</div> : ""}
      </>
    )
  }
}
