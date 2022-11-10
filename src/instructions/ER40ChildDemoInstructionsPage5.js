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
import cursor_1 from '../assets/er40Child/cursor-1.png';
import rpl_img from '../assets/er40Child/replay_img.png';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export default class ER40ChildDemoInstructionsPage5 extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state={
      stimulus:"",
      feedback: "",
      showReplay: false
    };
    this.emoji_array = [happy_emoji, sad_emoji, angry_emoji, fear_emoji, noe_emoji];
    this.updateReplay = this.updateReplay.bind(this);
  }

  componentDidMount(){
    this.props.canContinue(true);
    setTimeout(this.updateReplay, 5000);
  }

  updateReplay(){
    this.setState({
      showReplay: true
    });
  }

  render()
  {
    return (
      <div className="container-er40Slideshow">
        <div style={{display: "flex", alignItems: "center", justifyContent: "space-around", position: "relative", top: "80px"}}>
          <img src={happy_emoji} width="100px" />
          <img src={sad_emoji} width="100px"/>
          <img src={angry_emoji} width="100px"/>
          <img src={fear_emoji} width="100px"/>
          <img src={noe_emoji} width="100px"/>
        </div>
        <div style={{position: "relative", top: "26%", left: "20px"}}>
          <p>{this.props.text}</p>
        </div>
        {<div className="button replay-btn" onClick={this.props.replay}><img src={rpl_img} width="50px" height="50px" /></div>}
      </div>
    );
  }
}
