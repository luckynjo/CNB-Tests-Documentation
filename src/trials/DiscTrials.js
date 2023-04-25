import React from 'react';
import CNBResponse from './CNBResponse.js';

export class DiscTrials extends React.Component {
  constructor(props){
    super(props);
    const index = 0;
    const stimulusPart1 = this.props.stimuli[0];
    const stimulusPart2 = this.props.stimuli[1];
    this.state={
      index: index,
      trial: 0,
      stimulusPart1: stimulusPart1,
      stimulusPart2: stimulusPart2,
      trials: this.props.stimuli,
      trialTime: new Date(),
      responses: []
    };
    this.onClick = this.onClick.bind(this);
    this.nextTrial = this.nextTrial.bind(this);
    this.getStatement = this.getStatement.bind(this);
  }

    onClick(evt, response)
    {
      if(this.props.proc === "practice"){
        this.nextPracticeTrial();
        return;
      }
      const trial = this.state.trial;
      let responses = this.state.responses;
      let index = this.state.index;
      const duration = (new Date()) - this.state.trialTime;
      responses.push(new CNBResponse(index, response, duration));
      this.nextTrial(responses);
    }


    nextPracticeTrial(){
      const next_trial = this.state.trial + 2;
      const next_index = this.state.index + 1;
      const trial_count = this.props.stimuli.length;
      if(next_trial < trial_count){
        const stimulusPart1 = this.props.stimuli[next_trial];
        const stimulusPart2 = this.props.stimuli[next_trial+1];
        this.setState((prevState, props) => {
          return {index: next_index, trial: next_trial, stimulusPart1: stimulusPart1, stimulusPart2: stimulusPart2, trialTime: new Date()}
        });
      }
      else
      {
        this.props.onTrialsComplete();
      }
    }


    nextTrial(responses)
    {
      const next_trial = this.state.trial + 2;
      const trial_count = this.props.stimuli.length;
      const next_index = this.state.index + 1;

      // Continue task.
      if(next_trial < trial_count)
      {
        const stimulusPart1 = this.props.stimuli[next_trial];
        const stimulusPart2 = this.props.stimuli[next_trial+1];
        this.setState((prevState, props) => {
          return {index: next_index, trial: next_trial, stimulusPart1: stimulusPart1, stimulusPart2: stimulusPart2, trialTime: new Date(), responses: responses};
        });
      }
      // Task completed.
      else
      {
        this.props.onTrialsComplete(responses);
      }
    }


    getStatement(arr){
      let str = " ";
      for(let i=1; i<arr.length; i++){
        str = str + " " + arr[i];
      }
      return str;
    }


    render(){
      const stimulusPart1Amnt = this.state.stimulusPart1.trim().split(" ")[0];
      const stimulusPart1Stmnt = this.getStatement(this.state.stimulusPart1.trim().split(" "));
      const stimulusPart2Amnt = this.state.stimulusPart2.trim().split(" ")[0];
      const stimulusPart2Stmnt = this.getStatement(this.state.stimulusPart2.trim().split(" "));
      return(
        <div className="fill">
            <p className="discount-question">{this.props.hint}</p>
            <p className="discount-feedback"></p>
            <div className="button discount-button discount-button-top" onClick={e => this.onClick(e, this.state.stimulusPart1)}>
              <span className="discount-button-text-offset">
              {stimulusPart1Amnt}
              </span>
              <span className="discount-button-text-pink">
              {stimulusPart1Stmnt}
              </span>
            </div>
            <p className="discount-or">{this.props.orWord}</p>
            <div className="button discount-button discount-button-bottom" onClick={e => this.onClick(e, this.state.stimulusPart2)}>
              <span className="discount-button-text-offset">
              {stimulusPart2Amnt}
              </span>
              <span className="discount-button-text-pink">
              {stimulusPart2Stmnt}
              </span>
            </div>
        </div>
      );
    }
}
