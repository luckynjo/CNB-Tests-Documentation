import React from "react";
import CNBResponse from './CNBResponse.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {Randomizer} from '../utils/Randomizer.js';

export class MEDFTrials extends React.Component {
  constructor(props){
    super(props);
    this.getHint = this.getHint.bind(this);
    const trials = props.trials;
    const questions = Randomizer(trials, 1, true);
    const stimulus1 = this.findImage(JSON.parse(props.trials[questions[0]].stimulus)[0]);
    const stimulus2 = this.findImage(JSON.parse(props.trials[questions[0]].stimulus)[1]);
    const hintObj = JSON.parse(props.trials[questions[0]].stimulus)[2];
    this.state = {
      trial: 0,
      questions: questions,
      stimulus1: stimulus1,
      stimulus2: stimulus2,
      responses: [],
      trialTime: new Date(),
      hint: this.getHint(hintObj.hint)
    };

    this.responded = false;
    //this.onPracticeResponse = this.onPracticeResponse.bind(this);
    this.onTestResponse = this.onTestResponse.bind(this);
    this.nextTrial = this.nextTrial.bind(this);
    this.findImage = this.findImage.bind(this);
    this.findAssetFile = this.findAssetFile.bind(this);
    this.findAssetFileInArray = this.findAssetFileInArray.bind(this);
    this.correct = 0;
    this.incorrect = 0;
    this.response_map = [1, 3, 2];
  }

  onTestResponse(e, res)
  {
    const response = this.response_map[res];
    const trial = this.state.trial;
    const questions = this.state.questions;
    const question = this.props.trials[questions[trial]];
    let responses = this.state.responses;
    const duration = (new Date()) - this.state.trialTime;
    responses.push(new CNBResponse(question.question_number, response, duration));
    this.nextTrial(responses);
  }

  nextTrial(responses)
  {
    const next_trial = this.state.trial + 1;
    const trial_count = this.props.trials.length;

    // Continue task.
    if(next_trial < trial_count)
    {
      const questions = this.state.questions;
      const next_stimulus1 = this.findImage(JSON.parse(this.props.trials[questions[next_trial]].stimulus)[0]);
      const next_stimulus2 = this.findImage(JSON.parse(this.props.trials[questions[next_trial]].stimulus)[1]);
      const next_hintObj = JSON.parse(this.props.trials[questions[next_trial]].stimulus)[2];
      const next_hint = this.getHint(next_hintObj.hint);
      this.setState((prevState, props) => {
        return {trial: next_trial, stimulus1: next_stimulus1, stimulus2: next_stimulus2, trialTime: new Date(), responses: responses, hint: next_hint};
      });
    }
    // Task completed.
    else
    {
      this.props.onTrialsComplete(responses);
    }
  }

  getHint(eng_hint)
  {
    const happyHint = this.props.content[1];
    const angryHint = this.props.content[2];
    const afraidHint = this.props.content[3];
    const sadHint = this.props.content[4];

    if(eng_hint.includes("happy")){
      return happyHint;
    } else if (eng_hint.includes("angry")){
      return angryHint;
    } else if (eng_hint.includes("afraid")){
      return afraidHint;
    } else if (eng_hint.includes("sad")){
      return sadHint;
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
    const hint = this.state.hint;
    const buttons = this.props.buttons.map((item, index) => {
      return (<button className="button medf-memory-button" key={index + 155} onClick={(e) => this.onTestResponse(e, index)}>{item}</button>)
    })

    return (
      <div>
        <div className="page test">
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
      </div>
    );
  }
}
