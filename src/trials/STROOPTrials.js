import React from "react";
import CNBResponse from "./CNBResponse.js";

export class STROOPTrials extends React.Component {
  constructor(props){
    super(props);
    let stimulus = props.instructions[1];
    this.state = {
      index: 0,
      trial_number: 0,
      trial: props.trials[0],
      stimulus: stimulus,
      starttime: new Date(),
      respondedRed: 0,
      respondedBlue: 0,
      respondedGreen: 0,
      totalCorrectPressed: 0,
      responses: []
    }

    this.RED = 0xFF0000;
    this.BLUE = 0x0000FF;
    this.GREEN = 0x00FF00;
    this.key_red = "V";
    this.key_blue = "B";
    this.key_green = "N";
    this.responded = false;
    this.renderStimulus = this.renderStimulus.bind(this);
    this.showCrossHair = this.showCrossHair.bind(this);
    this.hideCrossHair = this.hideCrossHair.bind(this);
    this.nextTrial = this.nextTrial.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.onPracticeResponse = this.onPracticeResponse.bind(this);
    this.onTestResponse = this.onTestResponse.bind(this);
  }

  componentDidMount()
  {
    window.addEventListener("keydown", this.keyDown, false);
  }

  componentWillUnmount()
  {
    window.removeEventListener("keydown", this.keyDown, false);
  }

  componentDidUpdate(prevProps)
  {
    if(this.props.proc == "practice" && prevProps.instructions[0] !== this.props.instructions[0]){
      this.setState({trial: this.props.trials[0], stimulus: this.props.instructions[1]});
    }
  }

  showCrossHair()
  {
    this.setState((prevState, props) => {
      return {stimulus: "+"}
    }, this.hideCrossHair);
  }


  hideCrossHair()
  {
    setTimeout(() => {
      this.setState((prevState, props) => {
        return {stimulus : ""};
      });
      return this.nextTrial();
    }, 200);
  }


  nextTrial()
  {
    const trials_count = this.props.instructions.length;
    const next_index = this.state.index + 1;
    const next_trial_number = this.state.trial_number + 1;
    if(next_index < trials_count-1)
    {
      const stimulus = this.props.instructions[next_index+1];
      this.setState((prevState, props) => {
        return {index: next_index, trial_number: next_trial_number, stimulus: stimulus, trial: this.props.trials[next_trial_number], starttime: new Date()}
      });
    }
    else
    {
      this.props.onContinue();
      this.setState((prevState, props) => {
        return {index: 0, trial_number: next_trial_number, trial: this.props.trials[next_trial_number], starttime: new Date()}
      })
    }
  }



  keyDown(e)
  {
    e.stopPropagation();
    if(this.props.proc === "test")
    {
      this.onTestResponse(e);
    }
    else if(this.props.proc === "practice")
    {
      this.onPracticeResponse(e);
    }
  }


  onPracticeResponse(e)
  {
    let stimulus = this.state.stimulus;
    let key_str = String.fromCharCode(e.keyCode);
    let correct_response = this.state.trial.correct_response;

    if((key_str === this.key_red && correct_response === 'V') ||
      (key_str === this.key_blue && correct_response === 'B') ||
      (key_str === this.key_green && correct_response === 'N'))
    {
      this.responded = true;
      this.showCrossHair();
    }
  }


  onTestResponse(e)
  {
    let stimulus = this.state.stimulus;
    let key_str = String.fromCharCode(e.keyCode);
    let next_index = this.state.index + 1;
    let trials_count = this.props.trials.length;
    let correct_response = this.state.trial.correct_response;
    if((key_str === this.key_red && correct_response === 'V') ||
      (key_str === this.key_blue && correct_response === 'B') ||
      (key_str === this.key_green && correct_response === 'N'))
    {
      this.responded = true;
      var duration = new Date() - this.state.starttime;
      let responses = this.state.responses;
      responses.push(new CNBResponse(this.state.trial.question_number, key_str, duration));
      this.setState((prevState, props) => {
				return {responses: responses}
			});
      if(next_index < trials_count)
      {
        this.showCrossHair();
      }
      else
      {
        this.props.onTrialsComplete(this.state.responses);
      }
    }
  }


  renderStimulus(stim)
  {
    if(this.state.stimulus === "+")
    {
      return (<div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
          <div style={{fontSize:"80pt", fontWeight: "bold", color: "white", textAlign: "center"}}>
            +
          </div>
        </div>
      );
    }
    else if(this.props.proc == "practice")
    {
      let color="";
      if(this.state.trial.correct_response == "V")
      {
        color = "#FF0000";
      }
      else if(this.state.trial.correct_response == "B")
      {
        color = "#0000FF";
      }
      else if(this.state.trial.correct_response == "N")
      {
        color = "#00FF65";
      }
      return (
        <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
          <div style={{fontSize:"60pt", fontWeight: "bold", color:color, textAlign: "center"}}>
            {stim}
          </div>
        </div>
      );
    }
    else if(this.props.proc == "test")
    {
      let color="";
      if(this.state.trial.correct_response == "V")
      {
        color = "#FF0000";
      }
      else if(this.state.trial.correct_response == "B")
      {
        color = "#0000FF";
      }
      else if(this.state.trial.correct_response == "N")
      {
        color = "#00FF65";
      }
      return (
        <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
          <div style={{alignItems:"center",justifyContent: "center",fontSize:"60pt", fontWeight: "bold", color:color, textAlign: "center"}}>
            {stim}
          </div>
        </div>
      );
    }
  }


  render()
  {
    let stim = this.state.stimulus;
    return (
      <div className={'page'}>
      {this.props.proc === "practice" ? <div className="hint">{this.props.instructions[0]}</div> : ""}
        <div>
          {this.renderStimulus(stim)}
        </div>
      </div>
    );
  }
}
