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
import fear_practice from '../assets/er40Child/fear_pic.png';
import cursor_1 from '../assets/er40Child/cursor-1.png';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export default class ER40ChildDemoInstructionsPage3 extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state={
      stimulus:"",
      feedback: "",
    };
    this.emoji_array = [happy_emoji, sad_emoji, angry_emoji, fear_emoji, noe_emoji];
  }

  // componentDidMount(){
  //   this.props.canContinue(false);
  // }

  render()
  {
    let buttons = [];
     for(let i=0; i<5; i++){
       buttons.push((<div className="er40--response-button-3" key={i + 155}><img src={this.emoji_array[i]} height="50" width = "50"/></div>));
     }

    return (
      <div className="container-er40Slideshow">
          <table className="er40--table-2">
            <tbody>
            <tr>
            <td colSpan={2}>
            <p className={"er40--feedback-3"}>{this.props.instructions[0]}</p>
            </td>
            </tr>

              <tr>
                <td>
                  <div className="stimulus-3">
                    <div className="stimulus--container">
                      <div className="stimulus--er40-3">
                        <img src={fear_practice} />
                        <br/>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                <div className="responses-3">
                  {buttons}
                </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

    );
  }
}
