import React from "react";
import {GNGFeedbackInstructionsWithBtn} from '../instructions/GNGFeedbackInstructionsWithBtn.js';
import CNBResponse from './CNBResponse.js';

export class GNGShortTestTrialsWithBtn extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      index: -1,
      stimuli: null,
      startTime: null,
      showBlank: true,
      responses: [],
      is_pressed: true
    };

    this.duration = 300;
    this.blank = 900;
    this.pos_arr = [
    	{quest: 1, text: 'X', x: 124, y: 190, responded: false},
    	{quest: 2, text: 'X', x: 364, y: 130, responded: false},
    	{quest: 3, text: 'X', x: 604, y: 370, responded: false},
    	{quest: 4, text: 'X', x: 124, y: 190, responded: false},
    	{quest: 5, text: 'X', x: 364, y: 130, responded: false},
    	{quest: 6, text: 'X', x: 604, y: 190, responded: false},
    	{quest: 7, text: 'X', x: 364, y: 130, responded: false},
    	{quest: 8, text: 'Y', x: 124, y: 190, responded: false},
    	{quest: 9, text: 'X', x: 604, y: 190, responded: false},
    	{quest: 10, text: 'X', x: 604, y: 190, responded: false},
    	{quest: 11, text: 'X', x: 124, y: 190, responded: false},
    	{quest: 12, text: 'X', x: 364, y: 430, responded: false},
    	{quest: 13, text: 'X', x: 364, y: 130, responded: false},
    	{quest: 14, text: 'X', x: 124, y: 190, responded: false},
    	{quest: 15, text: 'X', x: 364, y: 130, responded: false},
    	{quest: 16, text: 'X', x: 124, y: 190, responded: false},
    	{quest: 17, text: 'X', x: 604, y: 370, responded: false},
    	{quest: 18, text: 'X', x: 604, y: 190, responded: false},
    	{quest: 19, text: 'Y', x: 124, y: 370, responded: false},
    	{quest: 20, text: 'X', x: 124, y: 190, responded: false},
    	{quest: 21, text: 'X', x: 364, y: 130, responded: false},
    	{quest: 22, text: 'X', x: 124, y: 370, responded: false},
    	{quest: 23, text: 'X', x: 364, y: 130, responded: false},
    	{quest: 24, text: 'Y', x: 604, y: 190, responded: false},
    	{quest: 25, text: 'X', x: 124, y: 370, responded: false},
    	{quest: 26, text: 'X', x: 604, y: 190, responded: false},
    	{quest: 27, text: 'X', x: 124, y: 190, responded: false},
    	{quest: 28, text: 'X', x: 604, y: 190, responded: false},
    	{quest: 29, text: 'Y', x: 364, y: 430, responded: false},
    	{quest: 30, text: 'X', x: 124, y: 190, responded: false},
    	{quest: 31, text: 'X', x: 604, y: 190, responded: false},
    	{quest: 32, text: 'Y', x: 364, y: 130, responded: false},
    	{quest: 33, text: 'X', x: 364, y: 430, responded: false},
    	{quest: 34, text: 'X', x: 124, y: 190, responded: false},
    	{quest: 35, text: 'Y', x: 604, y: 190, responded: false},
    	{quest: 36, text: 'X', x: 364, y: 130, responded: false},
    	{quest: 37, text: 'X', x: 604, y: 190, responded: false},
    	{quest: 38, text: 'X', x: 364, y: 430, responded: false},
    	{quest: 39, text: 'X', x: 604, y: 190, responded: false},
    	{quest: 40, text: 'Y', x: 364, y: 130, responded: false},
    	{quest: 41, text: 'X', x: 364, y: 130, responded: false},
    	{quest: 42, text: 'X', x: 604, y: 370, responded: false},
    	{quest: 43, text: 'Y', x: 124, y: 190, responded: false},
    	{quest: 44, text: 'X', x: 124, y: 190, responded: false},
    	{quest: 45, text: 'X', x: 364, y: 130, responded: false},
    	{quest: 46, text: 'X', x: 364, y: 430, responded: false},
    	{quest: 47, text: 'Y', x: 124, y: 190, responded: false},
    	{quest: 48, text: 'X', x: 124, y: 370, responded: false},
    	{quest: 49, text: 'X', x: 604, y: 370, responded: false},
    	{quest: 50, text: 'X', x: 124, y: 190, responded: false},
    	{quest: 51, text: 'X', x: 604, y: 190, responded: false},
    	{quest: 52, text: 'X', x: 364, y: 130, responded: false},
    	{quest: 53, text: 'X', x: 364, y: 130, responded: false},
    	{quest: 54, text: 'Y', x: 604, y: 190, responded: false},
    	{quest: 55, text: 'Y', x: 364, y: 130, responded: false},
    	{quest: 56, text: 'X', x: 124, y: 190, responded: false},
    	{quest: 57, text: 'X', x: 364, y: 130, responded: false},
    	{quest: 58, text: 'X', x: 604, y: 190, responded: false},
    	{quest: 59, text: 'X', x: 124, y: 190, responded: false},
    	{quest: 60, text: 'X', x: 364, y: 130, responded: false}
   ];
    this.setStimuli = this.setStimuli.bind(this);
    this.setShowBlank = this.setShowBlank.bind(this);
    this.onPress = this.onPress.bind(this);
  }

  componentDidMount(){
    //window.addEventListener("keydown", this.keyDown, false);
    window.addEventListener("click", this.onPress, false);
    this.setStimuli();
  }

  componentWillUnmount(){
    window.removeEventListener("click", this.onPress, false);
    if(this.timeid){
      clearTimeout(this.timeid);
    }
    if(this.timeid2){
      clearTimeout(this.timeid2);
    }
  }

  setStimuli()
  {
    const currIndex = this.state.index;
    const trialsCount = this.props.trials.length;
    const index = this.state.index;
    const nextIndex = currIndex + 1;
    console.log(this.state.responses);
    if(nextIndex < trialsCount){
      this.timeid = setTimeout(() => {
        const responses = this.state.responses;
        if(index > -1){
          const quest = this.pos_arr[index].quest;
          if(!this.pos_arr[index].responded){
            responses.push(new CNBResponse(quest, 0));
          }
          this.setState({
            index: nextIndex,
            stimuli: this.props.trials[nextIndex],
            startTime: new Date(),
            showBlank: false,
            responses: responses,
            is_pressed: false
          }, this.setShowBlank);
        } else {
          this.setState({
            index: nextIndex,
            stimuli: this.props.trials[nextIndex],
            startTime: new Date(),
            showBlank: false,
            is_pressed: false
          }, this.setShowBlank);
        }
      }, this.blank);
    } else
    {
      setTimeout(() => {
        const responses = this.state.responses;
        const quest = this.pos_arr[index].quest;
        if(!this.pos_arr[index].responded){
          responses.push(new CNBResponse(quest, 0));
        }
        this.props.onTrialsComplete(responses);
      }, this.blank);
    }
  }

  setShowBlank(){
    this.timeid2 = setTimeout(() => {
      this.setState({
        showBlank: true
      }, this.setStimuli);
    }, this.duration);
  }


  onPress(evt)
  {
    evt.stopPropagation();
    if(this.state.is_pressed){
      return;
    }
    let stimuli = this.state.stimuli;
    let index = this.state.index;
    const trials_count = this.props.trials.length;
    if(this.pos_arr[index].responded){
      return;
    }
    // if(evt.keyCode === 32){
    //   if(this.pos_arr[index].responded){
    //     return;
    //   }
    //   const duration = new Date() - this.state.startTime;
    //   let responses = this.state.responses;
    //   const quest = this.pos_arr[index].quest;
    //   responses.push(new CNBResponse(quest, 1, duration));
    //   this.pos_arr[index].responded = true;
    //   this.setState({
    //     responses: responses
    //   });
    // }

    const duration = new Date() - this.state.startTime;
    let responses = this.state.responses;
    const quest = this.pos_arr[index].quest;
    responses.push(new CNBResponse(quest, 1, duration));
    this.pos_arr[index].responded = true;
    this.setState({
      responses: responses,
      is_pressed: true
    });
  }


  render(){
    const stimuli = this.state.stimuli;
    const index = this.state.index;
    const pos_x = index > -1 ? this.pos_arr[index].x : null;
    const pos_y = index > -1 ? this.pos_arr[index].y : null;

    if(this.state.showBlank){
      return (
        <div className="clickable-box-gng">
          <div className="container-8-by-6  dark frame">
            <div className="page center">
              {/*<div style={{position: "absolute", display: "flex", left: "33%", bottom: "15px", transformX: "-50%", textAlign: "center", border: "2px solid white", color: "white", width: "236px", height: "32px", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={this.onPress}>Press</div>*/}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="clickable-box-gng">
        <div className="container-8-by-6  dark frame">
          <div className="page center">
            <p style={{position: "relative", left: pos_x, top: pos_y, fontSize: "24pt", fontWeight: "700"}}>{stimuli}</p>
            {/*<div style={{position: "absolute", display: "flex", left: "33%", bottom: "15px", transformX: "-50%", textAlign: "center", border: "2px solid white", color: "white", width: "236px", height: "32px", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={this.onPress}>Press</div>*/}
          </div>
        </div>
      </div>
    );
  }
}
