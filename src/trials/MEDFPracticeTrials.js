import React from "react";
import CNBResponse from './CNBResponse.js';
import {ContinueButton} from '../components/ContinueButton.js';

export class MEDFPracticeTrials extends React.Component {
  constructor(props){
    super(props);
    const stimulus1 = this.findImage(JSON.parse(props.trials[0].stimulus)[0]);
    const stimulus2 = this.findImage(JSON.parse(props.trials[0].stimulus)[1]);
    const hint = this.getHint(0);
    this.state = {
      trial: 0,
      stimulus1: stimulus1,
      stimulus2: stimulus2,
      responses: [],
      trialTime: new Date(),
      hint: hint
    };

    this.responded = false;
    this.onPracticeResponse = this.onPracticeResponse.bind(this);
    this.findImage = this.findImage.bind(this);
    this.findAssetFile = this.findAssetFile.bind(this);
    this.findAssetFileInArray = this.findAssetFileInArray.bind(this);
    this.getHint = this.getHint.bind(this);
    this.correct = 0;
    this.incorrect = 0;
    this.response_map = [1,3,2];
  }

  getHint(trial){
    const firstHint = this.props.content[1];
    const secondHint = this.props.content[2];
    const thirdHint = this.props.content[3];
    if(trial == 0){
      return firstHint;
    } else if (trial == 1){
      return secondHint;
    } else {
      return thirdHint;
    }
  }

  onPracticeResponse(e, res)
  {
    const response = this.response_map[res];
    const next_trial = this.state.trial + 1;
    const trial_count = this.props.trials.length;
    const trial = this.props.trials[this.state.trial];
    if(response != trial.correct_response){
      this.correct = 0;
      this.setState((prevState, props) => {
        return {feedback: this.props.feedback_incorrect};
      });
    }
    else
    {
      if(next_trial < trial_count)
      {
        const next_stimulus1 = this.findImage(JSON.parse(this.props.trials[next_trial].stimulus)[0]);
        const next_stimulus2 = this.findImage(JSON.parse(this.props.trials[next_trial].stimulus)[1]);
        this.setState((prevState, props) => {
          return {feedback: this.props.feedback_correct, stimulus1: next_stimulus1, stimulus2: next_stimulus2, trial: next_trial, hint: this.getHint(next_trial)};
        });
      }
      // Practice completed
      else
      {
        this.props.onPracticeComplete();
      }
    }
  }

  findImage(image_url)
  {
    const clean_url = image_url;
    if(this.props.images)
    {
      return this.findAssetFile(clean_url);
    }
    else return this.props.base_url + "stimuli/medf/" + clean_url;
  }

  findAssetFile(url)
  {
    let file = localStorage.getItem(url);
    if(!file)
    {
      file = this.findAssetFileInArray(url);
    }
    return file;
  }

  findAssetFileInArray(url)
  {
    let file = null;
    const assets = this.props.images || [];
    for(let i=0; i < assets.length; i++)
    {
      if((assets[i].url).includes(url))
      {
        file = assets[i].data;
        continue;
      }
    }
    return file || this.props.base_url + "stimuli/medf/" + url;
  }

  render()
  {
    const stimulus1 = this.state.stimulus1;
    const stimulus2 = this.state.stimulus2;
    const feedback = this.state.feedback;
    const hint = this.state.hint;
    const buttons = this.props.buttons.map((item, index) => {
      return (<button className="button memory-button" key={index + 155} onClick={(e) => this.onPracticeResponse(e, index)}>{item}</button>)
    })

    return (
      <div>
        <div className="feedback">
          <p className="text--center">{feedback}</p>
        </div>
        <div className="hint">
          <p className="hint text--center">{hint}</p>
        </div>
        <div className="comparison--stimuli">
          <div className="stimulus--medf"><img src={stimulus1}/></div>
          <div className="stimulus--medf"><img src={stimulus2}/></div>
        </div>
        <div className="comparison--responses center--horizontal">
          {buttons}
        </div>
      </div>
    );
  }
}
