import React from "react";
import {GNGFeedbackInstructions} from '../instructions/GNGFeedbackInstructions.js';

export class GNGPracticeTrials extends React.Component {
  constructor(props){
    super(props);
    //const stimulus = props.trials[0];
    this.state = {
      index: -1,
      stimuli: null,
      feedback: null,
      incorrect_count: 0,
      startTime: null,
      showBlank: true,
      practiceStarted: false,
      responses: []
    };

    this.duration = 300;
    this.blank = 900;
    this.pos_feedbk_resp_arr = [
      {x: 124, y: 190, correct: 32, feedback: 0},
      {x: 604, y: 190, correct: 32, feedback: 0},
      {x: 364, y: 430, correct: -1, feedback: 1},
      {x: 604, y: 370, correct: -1, feedback: 2},
      {x: 604, y: 190, correct: -1, feedback: 1},
      {x: 364, y: 130, correct: 32, feedback: 0},
      {x: 124, y: 370, correct: -1, feedback: 2},
      {x: 124, y: 190, correct: -1, feedback: 1},
      {x: 604, y: 190, correct: 32, feedback: 0},
      {x: 124, y: 190, correct: 32, feedback: 0},
      {x: 364, y: 430, correct: -1, feedback: 2},
      {x: 364, y: 130, correct: -1, feedback: 1}
    ];

    this.setStimuli = this.setStimuli.bind(this);
    this.setShowBlank = this.setShowBlank.bind(this);
    this.keyDown = this.keyDown.bind(this);

  }

  componentDidMount(){
    window.addEventListener("keydown", this.keyDown, false);
    if(this.props.incorrect_practice_cnt > 3){
      this.props.onTrialsComplete();
    }
    this.setStimuli();
  }


  componentWillUnmount(){
    if(this.timeid){
      clearTimeout(this.timeid);
    }
    if(this.timeid2){
      clearTimeout(this.timeid2);
    }
  }

  setStimuli()
  {
    if(this.state.feedback){
      if(this.timeid){
        clearTimeout(this.timeid);
      }
      if(this.timeid2){
        clearTimeout(this.timeid2);
      }
      return;
    }
    const currIndex = this.state.index;
    const trialsCount = this.props.trials.length;
    const nextIndex = currIndex + 1;
    if(nextIndex < trialsCount){
      this.timeid = setTimeout(() => {
        if(this.state.feedback){
          if(this.timeid){
            clearTimeout(this.timeid);
          }
          if(this.timeid2){
            clearTimeout(this.timeid2);
          }
          return;
        }
        const responses = this.state.responses;
        const response = currIndex !== -1 && responses.find(item => item.index === currIndex);
        const feedback = currIndex !== -1 ? this.pos_feedbk_resp_arr[currIndex].feedback : -1;
        if(currIndex !== -1 && feedback === 0 && !response){
          this.setState({
            feedback: this.props.feedback_false_neg
          });
          if(this.timeid){
            clearTimeout(this.timeid);
          }
          if(this.timeid2){
            clearTimeout(this.timeid2);
          }
          this.props.addIncorrectPracticeCnt();
          return;
        }
        this.setState({
          index: nextIndex,
          stimuli: this.props.trials[nextIndex],
          startTime: new Date(),
          showBlank: false,
          feedback: null
        }, this.setShowBlank);
      }, this.blank);
    }
    else
    {
      setTimeout(() => {
        if(this.state.feedback){
          if(this.timeid){
            clearTimeout(this.timeid);
          }
          if(this.timeid2){
            clearTimeout(this.timeid2);
          }
          return;
        }
        this.props.onTrialsComplete();
      }, this.blank);
    }
  }


  setShowBlank(){
    if(this.state.feedback){
      if(this.timeid){
        clearTimeout(this.timeid);
      }
      if(this.timeid2){
        clearTimeout(this.timeid2);
      }
      return;
    }
    this.timeid2 = setTimeout(() => {
      this.setState({
        showBlank: true
      }, this.setStimuli);
    }, this.duration);
  }


  keyDown(evt)
  {
    let stimuli = this.state.stimuli;
    let index = this.state.index;
    const correct_resp = this.pos_feedbk_resp_arr[index].correct;
    const feedback = this.pos_feedbk_resp_arr[index].feedback;
    const trials_count = this.props.trials.length;

    if(evt.keyCode === 32){
      if(evt.keyCode === correct_resp){
        const duration = new Date() - this.state.startTime;
        let responses = this.state.responses;
        responses.push({index: index, response: 1});
        this.setState({
          feedback: null,
          responses: responses
        });
      } else {
        if(feedback === 1){
          this.setState({
            feedback: this.props.feedback_false_pos_y
          }, () => this.props.addIncorrectPracticeCnt());
          if(this.timeid){
            clearTimeout(this.timeid);
          }
          if(this.timeid2){
            clearTimeout(this.timeid2);
          }
          return;
        }
        else if(feedback === 2){
          this.setState({
            feedback: this.props.feedback_false_pos_x
          }, () => this.props.addIncorrectPracticeCnt());
          if(this.timeid){
            clearTimeout(this.timeid);
          }
          if(this.timeid2){
            clearTimeout(this.timeid2);
          }
          return;
        }
      }
    }
  }


  render(){
    const stimuli = this.state.stimuli;
    const index = this.state.index;
    const pos_x = index > -1 ? this.pos_feedbk_resp_arr[index].x : null;
    const pos_y = index > -1 ? this.pos_feedbk_resp_arr[index].y : null;
    if(this.state.feedback){
      return <GNGFeedbackInstructions instructions={this.state.feedback} incorrect_practice_cnt={this.props.incorrect_practice_cnt} onPracticeGoBack={this.props.back} onTrialsComplete={this.props.onTrialsComplete} spacebar_text={this.props.spacebar_text}/>
    }

    if(this.state.showBlank){
      return (
        <div className="page center"></div>
      );
    }
    return (
      <div className="page center">
        <p style={{position: "relative", left: pos_x, top: pos_y, fontSize: "24pt", fontWeight: "700"}}>{stimuli}</p>
      </div>
    );
  }
}
